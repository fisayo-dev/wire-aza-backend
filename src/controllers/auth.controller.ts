import { NextFunction } from "express";
import AuthService from "../services/AuthService.ts";
import AuthRepo from "../repositories/auth.repo.ts";
class AuthController {
  constructor(private authService: AuthService, private authRepo: AuthRepo) {}

  signupByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const user_details = req.body;
    try {
      this.authRepo.checkIfEmailExist(user_details?.email);
    } catch (error) {
      next(error);
    }
  };
  loginByEmail = async (req: Request, res: Response, next: NextFunction) => {};
  signupByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
  loginByOAuth = async (req: Request, res: Response, next: NextFunction) => {};
}

export default AuthController;
