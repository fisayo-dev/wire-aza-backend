import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";
import { sendError, sendSuccess } from "../utils/response.ts";
import env from "../configs/env.ts"; // Load once at startup!

class AuthController {
  constructor(private service: AuthService) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_details = req.body;
      const result = await this.service.signupByEmail(user_details);
      return sendSuccess(res, "User registered successfully", result, 201);
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        return sendError(res, "User with this email already exists", 409);
      }
      next(error);
    }
  };

  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.loginByEmail(email, password);
      return sendSuccess(res, "Login successful", result);
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        return sendError(res, "Invalid email or password", 401);
      }
      next(error);
    }
  };

  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oauthId, provider } = req.body;
      const result = await this.service.loginByOAuth(oauthId, provider);
      return sendSuccess(res, "OAuth login successful", result);
    } catch (error: any) {
      if (error.message === "OAuth account not found") {
        return sendError(res, "Account not found", 404);
      }

      next(error);
    }
  };

  getOAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;

      if (!["google", "github"].includes(provider as "google" | "github")) {
        return sendError(res, "Unsupported OAuth provider", 400);
      }

      const url = this.service.getOAuthRedirectUrl(
        provider as "google" | "github"
      );

      return sendSuccess(res, "OAuth URL generated", { authUrl: url });
    } catch (error: any) {
      next(error);
    }
  };

  oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;
      const code = req.query.code as string;

      if (!code) {
        return sendError(res, "Authorization code missing", 400);
      }

      const result = await this.service.handleOAuthCallback(
        provider as "google" | "github",
        code
      );

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(`${env.FRONTEND_URL}/dashboard`);
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      const redirectUrl = new URL(`${env.FRONTEND_URL}/auth/error`);
      redirectUrl.searchParams.set(
        "error",
        error.message || "Authentication failed"
      );
      return res.redirect(redirectUrl.toString());
    }
  };
}

export default AuthController;
