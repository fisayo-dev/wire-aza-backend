import { Request, Response, NextFunction } from "express";
import { sendError, sendServerError } from "../utils/response.ts";
import HttpError from "../utils/httpError.ts";

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Mongoose validation errors (e.g., required fields, format)
  if (err && err.name === "ValidationError") {
    const messages = Object.values(err.errors || {})
      .map((e: any) => e.message)
      .join(", ");
    return sendError(res, messages || "Validation error", 400, messages);
  }

  // MongoDB/Mongoose duplicate key error (E11000 - most common for unique: true fields like email)
  if (
    err &&
    (err.code === 11000 ||
      err.code === 11001 ||
      err.message?.includes("E11000"))
  ) {
    // Extract the field and value if possible for a better message
    let message = "Duplicate key error";
    if (err.message) {
      const match = err.message.match(
        /index:\s*\w+_\d+\s*dup key:\s*{\s*(\w+):\s*"([^"]+)"\s*}/
      );
      if (match) {
        const field = match[1];
        const value = match[2];
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } '${value}' already exists`;
      } else if (err.message.includes("email")) {
        message = "Email already exists";
      }
    }
    return sendError(res, message, 409); // 409 Conflict is more semantic for duplicates
  }

  // Custom HttpError
  if (err instanceof HttpError) {
    const details = err.details ? JSON.stringify(err.details) : undefined;
    return sendError(
      res,
      err.message || "Error",
      err.statusCode || 400,
      details
    );
  }

  // Common string-based error messages
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

  // Fallback: internal server error
  const isDev = process.env.NODE_ENV !== "production";
  const message =
    (err && (err.message || err.toString())) || "Internal server error";
  const errorDetail = isDev
    ? err && (err.stack || JSON.stringify(err))
    : undefined;
  return sendServerError(res, message, errorDetail);
};

export default errorMiddleware;
