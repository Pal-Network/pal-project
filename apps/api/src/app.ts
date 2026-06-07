import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth";
import { conversationsRouter } from "./routes/conversations";
import { healthRouter } from "./routes/health";
import { matchesRouter } from "./routes/matches";
import { opportunitiesRouter } from "./routes/opportunities";
import { usersRouter } from "./routes/users";

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/v1", healthRouter);
  app.use("/api/v1", authRouter);
  app.use("/api/v1", usersRouter);
  app.use("/api/v1", matchesRouter);
  app.use("/api/v1", conversationsRouter);
  app.use("/api/v1", opportunitiesRouter);

  return app;
}
