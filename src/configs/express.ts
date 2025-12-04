import express from "express";
import cors from "cors";
import { FRONTEND_URL } from "./env.ts";

export const app = express();
export const appRouter = express.Router();

const corsOptions = {
  origin: FRONTEND_URL!,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

console.log("🔐 CORS configured with origin:", FRONTEND_URL);

// Allow cookies in development (trust proxy for production)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Trust first proxy in production
}

// Use cors middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use middlewares (error handler is registered after routes in server.ts)
