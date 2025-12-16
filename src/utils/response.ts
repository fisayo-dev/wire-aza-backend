// utils/response.ts

import { Response } from "express";
import { ApiResponse } from "../types/interfaces/index.ts";
import * as dotenv from "dotenv";
dotenv.config();

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

  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // lowercase "none"
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Ensure cookie is available for all routes
    // domain: isProduction ? process.env.FRONTEND_URL?.replace(/^https?:\/\//, '') : 'localhost',
  };

  res.cookie("wire-aza-session", token, cookieOptions);
  res.status(statusCode).json(response);
};

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
