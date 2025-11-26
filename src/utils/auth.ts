import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET_KEY } from "../configs/env.ts";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const signToken = (seed: string) => {
  const token = jwt.sign({ userId: seed }, JWT_SECRET_KEY!, {
    expiresIn: JWT_EXPIRY!,
  });
  return token;
};

export const comparePassword = async (password: string, dbPassword: string) => {
  const passwordCheck = bcrypt.compare(password, dbPassword);
  return passwordCheck;
};
