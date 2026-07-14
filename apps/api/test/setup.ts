process.env.MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/pal-test";
process.env.GITHUB_CLIENT_ID = "test-client-id";
process.env.GITHUB_CLIENT_SECRET = "test-client-secret";
process.env.GITHUB_CALLBACK_URL =
  "http://localhost:8080/api/v1/auth/github/callback";
process.env.JWT_SECRET = "test-secret";
process.env.STELLAR_HORIZON_URL = "https://horizon-testnet.stellar.org";
process.env.STELLAR_FRIENDBOT_URL = "https://friendbot.stellar.org";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserModel } from "../src/models/User";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await UserModel.init();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
