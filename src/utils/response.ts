// utils/response.ts

import { Response } from "express";
import { ApiResponse } from "../types/interfaces/index.ts";
import { FRONTEND_URL } from "../configs/env.ts";
import { is } from "zod/locales";

/**
 * Send a successful response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(response);
};

/**
 * NEW: Send success + set httpOnly session cookie
 */
export const sendSuccessWithCookie = <T>(
  res: Response,
  message: string,
  data: T,
  token: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  const isProduction = process.env.NODE_ENV === "production";

  // Development: use sameSite: "lax" with secure: false
  // Production: use sameSite: "none" with secure: true for cross-origin
  const cookieOptions = {
    // domain: "localhost:8000",
    // httpOnly: isProduction,
    secure: isProduction,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };

  console.log("🍪 Setting cookie:", {
    name: "wire-aza-session",
    token: token.substring(0, 20) + "...",
    ...cookieOptions,
  });

  res.cookie("wire-aza-session", token, cookieOptions);

  res.status(statusCode).json(response);
};

// Keep your existing error helpers unchanged...
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
  };
  return res.status(statusCode).json(response);
};

export const sendServerError = (
  res: Response,
  message: string = "Internal server error",
  error?: string
): Response => sendError(res, message, 500, error);

export const sendNotFound = (
  res: Response,
  message: string = "Resource not found"
): Response => sendError(res, message, 404);

export const sendUnauthorized = (
  res: Response,
  message: string = "Unauthorized"
): Response => sendError(res, message, 401);

export const sendForbidden = (
  res: Response,
  message: string = "Forbidden"
): Response => sendError(res, message, 403);
