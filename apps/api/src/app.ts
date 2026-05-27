import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { usersRouter } from "./routes/users";

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/v1", healthRouter);
  app.use("/api/v1", authRouter);
  app.use("/api/v1", usersRouter);

  return app;
}
