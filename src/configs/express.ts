import express from "express";
import errorMiddleware from "../middlewares/error.middleware.ts";
import cors from "cors";
import { FRONTEND_URL } from "./env.ts";

export const app = express();
export const appRouter = express.Router();

const corsOptions = {
  origin: FRONTEND_URL!,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Use cors middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use middlewares
app.use(errorMiddleware);
