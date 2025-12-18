// controllers/OrganizationController.ts

import { NextFunction, Request, Response } from "express";
import OrganizationService from "../services/OrganizationService.ts";
import { sendSuccess } from "../utils/response.ts";
import { AuthRequest } from "../middlewares/auth.middleware.ts";

class OrganizationController {
  constructor(private service: OrganizationService) {}

  createOrganization = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organization_details = req.body;
      const userId = req.userId!;
      const result = await this.service.createOrganization(
        organization_details,
        userId
      );

      sendSuccess(res, "Organization created successfully", result, 201);
    } catch (error: any) {
      next(error);
    }
  };

  getAllOrganizations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizations = await this.service.getAllOrganizations();
      sendSuccess(res, "Organizations fetched successfully", organizations);
    } catch (error: any) {
      next(error);
    }
  };

  getOrganizationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Implementation for fetching organization by ID
    } catch (error: any) {
      next(error);
    }
  };

  updateOrganization = async ( 
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Implementation for updating organization details
    } catch (error: any) {
      next(error);
    }
  };

  deleteOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Implementation for deleting an organization
    } catch (error: any) {
      next(error);
    }
  };
}

export default OrganizationController;
