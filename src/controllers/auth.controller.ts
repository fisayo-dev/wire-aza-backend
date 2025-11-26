import { NextFunction } from "express";
import AuthService from "../services/AuthService.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import { sendNotFound } from "../utils/response.ts";
class AuthController {
  constructor(private authService: AuthService, private authRepo: AuthRepo) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const user_details = req.body;
    try {
      // Check if email exist
      const user = this.authRepo.getUser(user_details?.email);
      if (user) sendNotFound(res, "User with this email already exists");

      // Log User In
    } catch (error) {
      next(error);
    }
  };
  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {};
  signupByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
}

export default AuthController;
