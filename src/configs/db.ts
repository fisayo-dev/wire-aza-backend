import mongoose from "mongoose";
import { MONGO_DB_URI } from "./env.ts";
import { LoggerType } from "../types/enums/logger.ts";
import { logger } from "../utils/logger.ts";

const connectDB = async () => {
  if (!MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined in environment variables");
  }
  try {
    await mongoose.connect(MONGO_DB_URI);
    logger("___ MongoDB connected ___");
  } catch (error) {
    logger(
      `MongoDB connection error:
      ${error instanceof Error ? error.message : String(error)}`,
      LoggerType.error
    );
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
