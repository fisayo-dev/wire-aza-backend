import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/response.ts";

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const errorMessages = error.errors
        .map((err: any) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return sendError(res, "Validation error", 400, errorMessages);
    }
  };
