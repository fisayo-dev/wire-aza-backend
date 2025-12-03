// utils/response.ts

import { Response } from "express";
import { ApiResponse } from "../types/interfaces/index.ts";
import env from "../configs/env.ts";

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
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("wire-aza-session", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // important: make cookie available on all routes
  });

  return res.status(statusCode).json(response);
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
