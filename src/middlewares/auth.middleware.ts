import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.ts";
import { JWT_SECRET_KEY } from "../configs/env.ts";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.["wire-aza-session"];
    console.log("Auth Middleware - Token from cookies:", token);

    if (!token) {
      return sendError(res, "Authentication required", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY!) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch {
    return sendError(res, "Invalid or expired session", 401);
  }
};

export default authMiddleware;
