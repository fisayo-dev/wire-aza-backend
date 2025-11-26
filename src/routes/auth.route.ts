import { Router } from "express";
import AuthController from "../controllers/auth.controller.ts";
import AuthService from "../services/AuthService.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import { validateRequest } from "../middlewares/validation.middleware.ts";
import {
  emailSignupSchema,
  emailLoginSchema,
  oauthLoginSchema,
} from "../validations/auth.validation.ts";

const router = Router();

// Dependency setup (can be moved to a container later)
const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService); // Only service needed!

// Email auth
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

router.get("/auth/oauth/:provider", authController.getOAuthUrl);
router.get("/auth/oauth/:provider/callback", authController.oauthCallback);

export default router;
