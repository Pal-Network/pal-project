import "dotenv/config";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`API listening on :${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
