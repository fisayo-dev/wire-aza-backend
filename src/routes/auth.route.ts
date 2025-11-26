import { Router } from "express";
import AuthController from "../controllers/auth.controller.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import AuthService from "../services/AuthService.ts";

const router = Router();

const authRepo = new AuthRepo();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService, authRepo);

router.post("/auth/signup", authController.signupByEmail);
router.post("/auth/login", authController.loginByEmail);
router.post("/auth/signup/oauth", authController.signupByOAuth);
router.post("/auth/login/oauth", authController.loginByOAuth);

export default router;
