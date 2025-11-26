import connectDB from "./configs/db.ts";
import { PORT } from "./configs/env.ts";
import { app } from "./configs/express.ts";
import { logger } from "./utils/logger.ts";
import { sendSuccess } from "./utils/response.ts";
import authRoute from "./routes/auth.route.ts";

app.get("/api/v1/", (_, res) => {
  sendSuccess(res, "Wire aza api working");
});

app.get("/api/v1/health", (_, res) => {
  sendSuccess(res, "Health status of api is ok ✅");
});

// Register auth routes
app.use("/api/v1", authRoute);

app.listen(PORT, async () => {
  logger(`Server running on http://localhost:${PORT}`);
  await connectDB();
});
