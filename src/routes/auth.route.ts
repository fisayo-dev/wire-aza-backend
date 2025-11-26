import { Router } from "express";
import AuthController from "../controllers/auth.controller.ts";
import AuthRepo from "../repositories/auth.repo.ts";
import AuthService from "../services/AuthService.ts";

const router = Router();

const repo = new AuthRepo();
const service = new AuthService(repo);
const controller = new AuthController(service, repo);

router.post("/auth/signup", controller.signupByEmail);
router.post("/auth/login", controller.loginByEmail);
router.post("/auth/signup/oauth", controller.signupByOAuth);
router.post("/auth/login/oauth", controller.loginByOAuth);

export default router;
