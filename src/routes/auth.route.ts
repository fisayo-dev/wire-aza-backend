import { Router } from "express";
import AuthController from "../controllers/auth.controller.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import AuthService from "../services/AuthService.ts";
import { validateRequest } from "../middlewares/validation.middleware.ts";
import {
  emailSignupSchema,
  emailLoginSchema,
  oauthLoginSchema,
} from "../validations/auth.validation.ts";

const router = Router();

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService, authRepo);

router.post(
  "/auth/signup",
  validateRequest(emailSignupSchema),
  authController.signupByEmail
);
router.post(
  "/auth/login",
  validateRequest(emailLoginSchema),
  authController.loginByEmail
);
router.post(
  "/auth/login/oauth",
  validateRequest(oauthLoginSchema),
  authController.loginByOAuth
);

export default router;
