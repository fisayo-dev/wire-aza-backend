import { config } from "dotenv";

config({ path: ".env" });

export const { PORT, MONGO_DB_URI, JWT_SECRET_KEY, JWT_EXPIRY } = process.env;
