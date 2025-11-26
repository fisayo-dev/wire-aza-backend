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

  signupByOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;

      const result = await this.service.signupByOAuth(payload);
      return sendSuccess(res, "OAuth signup successful", result, 201);
    } catch (error: any) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("already registered")
      ) {
        return sendError(res, error.message, 409);
      }
      next(error);
    }
  };

  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, oauthId, provider } = req.body;

      const result = await this.service.loginByOAuth(oauthId, provider);
      return sendSuccess(res, "OAuth login successful", result, 200);
    } catch (error: any) {
      if (error.message === "OAuth account not found") {
        return sendError(res, error.message, 404);
      }
      next(error);
    }
  };
}

export default AuthController;
