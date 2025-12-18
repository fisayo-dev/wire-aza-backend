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
}

export default OrganizationController;
