// controllers/AuthController.ts

import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";
import {
  sendError,
  sendSuccess,
  sendSuccessWithCookie,
} from "../utils/response.ts";
import env from "../configs/env.ts";

class AuthController {
  constructor(private service: AuthService) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_details = req.body;
      const result = await this.service.signupByEmail(user_details);

      // Now uses centralized cookie + response logic
      sendSuccessWithCookie(
        res,
        "User registered successfully",
        result,
        result.token,
        201
      );
    } catch (error: any) {
      // Forward the error to centralized error middleware
      next(error);
    }
  };

  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.loginByEmail(email, password);

      // Now uses centralized cookie + response logic
      return sendSuccessWithCookie(
        res,
        "User logged in ",
        result,
        result.token,
      );
    } catch (error: any) {
      next(error);
    }
  };

  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oauthId, provider } = req.body;
      const result = await this.service.loginByOAuth(oauthId, provider);

      sendSuccessWithCookie(
        res,
        "OAuth login successful",
        result,
        result.token
      );
    } catch (error: any) {
      next(error);
    }
  };

  getOAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;

      if (!["google", "github"].includes(provider as string)) {
        return sendError(res, "Unsupported OAuth provider", 400);
      }

      const url = this.service.getOAuthRedirectUrl(
        provider as "google" | "github"
      );

      sendSuccess(res, "OAuth URL generated", { authUrl: url });
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

      // Still set cookie here because we're redirecting (not sending JSON)
      const isProduction = process.env.NODE_ENV === "production";
      sendSuccessWithCookie(
        res,
        "OAuth login successful",
        result,
        result.token
      );

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
