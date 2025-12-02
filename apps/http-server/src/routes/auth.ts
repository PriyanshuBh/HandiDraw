import { Router } from "express";
import { handleGoogleCallback, initiateGoogleSignin, initiateGoogleSignup } from "../controlers/oauthHandler.js";
import { forgotPasswordHandler } from '../controlers/forgotPasswordHandler.js'; // New import
import { resetPasswordHandler } from '../controlers/resetPasswordHandler.js';   // New import

const authRouter: Router = Router();

authRouter.get("/google/signin", initiateGoogleSignin);
authRouter.get("/google/callback", handleGoogleCallback);

// New routes for password reset
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password', resetPasswordHandler);

export default authRouter;