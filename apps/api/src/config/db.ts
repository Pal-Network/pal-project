import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);
  return mongoose.connect(env.MONGODB_URI);
}
