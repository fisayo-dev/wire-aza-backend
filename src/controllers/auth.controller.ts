import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import { sendNotFound } from "../utils/response.ts";
class AuthController {
  constructor(private service: AuthService, private repo: AuthRepo) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const user_details = req.body;
    try {
      // Check if email exist
      const user = await this.repo.getUser(user_details?.email);
      if (user) return sendNotFound(res, "User with this email already exists");

      await this.service.signupByEmail(req.body);
    } catch (error) {
      next(error);
    }
  };
  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {};
  signupByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
}

export default AuthController;
