import "dotenv/config";
import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", healthRouter);

const port = Number(process.env.PORT ?? 8080);

app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
