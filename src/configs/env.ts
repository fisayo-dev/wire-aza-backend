import { config } from "dotenv";

config({ path: ".env" });

export const {
  PORT,
  MONGO_DB_URI,
} = process.env;
