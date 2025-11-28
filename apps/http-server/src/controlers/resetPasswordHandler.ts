import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prismaClient } from "@repo/db/client";

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password should be at least 8 characters')
    .max(100, 'Password should not exceed 100 characters')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
  confirmPassword: z.string(),
}).strict().refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const validationResult = resetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      msg: 'Invalid input',
      errors: validationResult.error.issues,
    });
  }

  const { token, newPassword } = validationResult.data;

  try {
    // Find the token in the database
    const resetTokenRecord = await prismaClient.passwordResetToken.findFirst({
      where: {
        expiresAt: {
          gt: new Date(), // Token must not be expired
        },
      },
      include: {
        user: true, // Include user data to easily update password
      },
    });

    if (!resetTokenRecord || !resetTokenRecord.user) {
      return res.status(400).json({ msg: 'Invalid or expired password reset token.' });
    }

    // Verify the token (compare raw token from request with hashed token in DB)
    const isTokenValid = await bcrypt.compare(token, resetTokenRecord.token);
    if (!isTokenValid) {
      return res.status(400).json({ msg: 'Invalid or expired password reset token.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prismaClient.user.update({
      where: { id: resetTokenRecord.userId },
      data: { password: hashedPassword },
    });

    // Invalidate/delete the used token
    await prismaClient.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });

    return res.status(200).json({ msg: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password handler error:', error);
    return res.status(500).json({
      msg: 'Internal server error. Please try again later.',
    });
  }
};
