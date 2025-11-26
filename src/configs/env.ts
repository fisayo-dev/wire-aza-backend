import { config } from "dotenv";

config({ path: ".env" });

export const {
  PORT,
  MONGO_DB_URI,
  JWT_SECRET_KEY,
  JWT_EXPIRY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  OAUTH_CALLBACK_URL_BASE,
  FRONTEND_URL,
} = process.env;

const env = process.env;
export default env;
