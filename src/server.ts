import connectDB from "./configs/db.ts";
import express from "express";
import cors from "cors";
import { PORT, FRONTEND_URL } from "./configs/env.ts";
import { logger } from "./utils/logger.ts";
import { sendSuccess } from "./utils/response.ts";
import authRoute from "./routes/auth.route.ts";
import organizationRoute from "./routes/organization.route.ts";
import errorMiddleware from "./middlewares/error.middleware.ts";
import cookieParser from "cookie-parser";


// Create Express app and configure middleware (moved from src/configs/express.ts)
export const app = express();

const corsOptions = {
  origin: FRONTEND_URL!,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};

console.log("🔐 CORS configured with origin:", FRONTEND_URL);

// Allow cookies in development (trust proxy for production)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Trust first proxy in production
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base route
app.get("/api/v1/", (_, res) => {
  sendSuccess(res, "Wire aza api working");
});

// Health route
app.get("/api/v1/health", (_, res) => {
  sendSuccess(res, "Health status of api is ok ✅");
});

// Register auth routes
app.use("/api/v1", authRoute);

// Register organization routes
app.use("/api/v1", organizationRoute);

// Register centralized error handler after all routes
app.use(errorMiddleware);

app.listen(PORT, async () => {
  logger(`Server running on http://localhost:${PORT}`);
  await connectDB();
});
