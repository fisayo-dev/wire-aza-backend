import { Router } from "express";
import OrganizationController from "../controllers/organization.controller.ts";
import OrganizationService from "../services/OrganizationService.ts";
import OrganizationRepo from "../repositories/organization.repo.ts";
import { validateRequest } from "../middlewares/validation.middleware.ts";
import { createOrganizationSchema } from "../validations/organization.validation.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

// Dependency setup (can be moved to a container later)
const organizationRepo = new OrganizationRepo();
const organizationService = new OrganizationService(organizationRepo);
const organizationController = new OrganizationController(organizationService);

// Create organization
router.post(
  "/organizations",
  authMiddleware,
  validateRequest(createOrganizationSchema),
  organizationController.createOrganization
);

// Get all organizations
router.get(
  "/organizations",
  authMiddleware,
  organizationController.getAllOrganizations
);

// Get organization by ID
router.get(
  "/organizations/:id",
  authMiddleware,
  organizationController.getOrganizationById
);

export default router;
