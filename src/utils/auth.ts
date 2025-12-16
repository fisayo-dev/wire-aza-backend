import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET_KEY } from "../configs/env.ts";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const signToken = (seed: string) => {
  if (!JWT_SECRET_KEY || !JWT_EXPIRY) {
    throw new Error("JWT_SECRET_KEY or JWT_EXPIRY is not configured");
  }
  const token = (jwt.sign as any)({ userId: seed }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRY,
  });
  return token;
};

export const comparePassword = async (password: string, dbPassword: string) => {
  const passwordCheck = bcrypt.compare(password, dbPassword);
  return passwordCheck;
};
