import { Request, Response, NextFunction } from "express";
import { sendError, sendServerError } from "../utils/response.ts";
import HttpError from "../utils/httpError.ts";

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Mongoose validation errors
  if (err && err.name === "ValidationError") {
    const messages = Object.values(err.errors || {})
      .map((e: any) => e.message)
      .join(", ");
    return sendError(res, messages || "Validation error", 400, messages);
  }

  // Duplicate key error (MongoDB)
  if (err && (err.code === 11000 || err.code === 11001)) {
    const keyValue = err.keyValue || {};
    const key = Object.keys(keyValue)[0];
    const value = key ? keyValue[key] : undefined;
    const message = key ? `Duplicate ${key}: ${value}` : "Duplicate key error";
    return sendError(res, message, 409, JSON.stringify(keyValue));
  }

  // If a typed HttpError was thrown
  if (err instanceof HttpError) {
    const details = err.details ? JSON.stringify(err.details) : undefined;
    return sendError(
      res,
      err.message || "Error",
      err.statusCode || 400,
      details
    );
  }

  // Common auth-specific messages
  if (err && typeof err.message === "string") {
    if (err.message.includes("OAuth account not found")) {
      return sendError(res, "Account not found", 404);
    }
    if (err.message.includes("Invalid email or password")) {
      return sendError(res, "Invalid email or password", 401);
    }
    if (err.message.includes("already exists")) {
      return sendError(res, err.message, 409);
    }
    if (err.message.includes("does not exist")) {
      return sendError(res, err.message, 404);
    }
  }

  // Fallback: server error
  const isDev = process.env.NODE_ENV !== "production";
  const message =
    (err && (err.message || err.toString())) || "Internal server error";
  const errorDetail = isDev
    ? err && (err.stack || JSON.stringify(err))
    : undefined;
  return sendServerError(res, message, errorDetail);
};

export default errorMiddleware;
