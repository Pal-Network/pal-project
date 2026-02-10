import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  MONGODB_URI: str(),
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  STELLAR_HORIZON_URL: url(),
  STELLAR_FRIENDBOT_URL: url()
});
