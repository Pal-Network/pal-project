import "dotenv/config";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", healthRouter);

app.listen(env.PORT, () => {
  console.log(`API listening on :${env.PORT}`);
});
