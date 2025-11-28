import { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prismaClient } from "@repo/db/client";
import { sendPasswordResetEmail } from '../config/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
}).strict();

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const validationResult = forgotPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      msg: 'Invalid input',
      errors: validationResult.error.issues,
    });
  }

  const { email } = validationResult.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    // Always respond with a generic success message for security reasons
    // to avoid revealing whether an email exists in the database.
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        msg: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate a unique, cryptographically secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10); // Hash the token for storage

    // Set token expiration (e.g., 1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store the hashed token and its expiration in the database
    // First, delete any existing tokens for this user to ensure only one active token
    await prismaClient.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prismaClient.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedResetToken,
        expiresAt: expiresAt,
      },
    });

    // Construct the reset link for the user
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send the password reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetLink);

    if (!emailSent) {
      // Log the error but still send generic success to frontend
      console.error(`Failed to send password reset email to ${user.email}`);
    }

    return res.status(200).json({
      msg: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password handler error:', error);
    return res.status(500).json({
      msg: 'Internal server error. Please try again later.',
    });
  }
};
