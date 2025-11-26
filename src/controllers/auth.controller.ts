import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import { sendError, sendSuccess, sendServerError } from "../utils/response.ts";

class AuthController {
  constructor(private service: AuthService, private repo: AuthRepo) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_details = req.body;

      // Check if email exist
      const user = await this.repo.getUser(user_details?.email);
      if (user) {
        return sendError(res, "User with this email already exists", 409);
      }

      const result = await this.service.signupByEmail(user_details);
      return sendSuccess(res, "User registered successfully", result, 201);
    } catch (error: any) {
      next(error);
    }
  };

  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await this.service.loginByEmail(email, password);
      return sendSuccess(res, "Login successful", result, 200);
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        return sendError(res, error.message, 401);
      }
      next(error);
    }
  };

  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oauthId, provider } = req.body;

      const result = await this.service.loginByOAuth(oauthId, provider);
      return sendSuccess(res, "OAuth login successful", result, 200);
    } catch (error: any) {
      if (error.message === "OAuth account not found") {
        return sendError(res, error.message, 404);
      }
      next(error);
    }
  };

  startOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provider = req.params.provider;
      const url = this.service.getOAuthRedirectUrl(
        provider as "google" | "github"
      );
      return res.redirect(url);
    } catch (error: any) {
      next(error);
    }
  };

  getOAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provider = req.params.provider;
      const url = this.service.getOAuthRedirectUrl(
        provider as "google" | "github"
      );
      return sendSuccess(res, "OAuth URL generated", { authUrl: url }, 200);
    } catch (error: any) {
      next(error);
    }
  };

  oauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provider = req.params.provider;
      const code = req.query.code as string;

      if (!code) {
        return sendError(res, "Authorization code is missing", 400);
      }

      const result = await this.service.handleOAuthCallback(
        provider as "google" | "github",
        code
      );

      // If FRONTEND_URL is set, redirect to frontend with token
      const { FRONTEND_URL } = require("../configs/env.ts");
      if (FRONTEND_URL) {
        const redirectUrl = new URL(`${FRONTEND_URL}/auth/callback`);
        redirectUrl.searchParams.set("token", result.token);
        redirectUrl.searchParams.set("userId", result.user.id.toString());
        redirectUrl.searchParams.set("email", result.user.email);
        return res.redirect(redirectUrl.toString());
      }

      return sendSuccess(res, "OAuth login successful", result, 200);
    } catch (error: any) {
      next(error);
    }
  };
}

export default AuthController;
