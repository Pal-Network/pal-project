import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  MONGODB_URI: str(),
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  GITHUB_CALLBACK_URL: str({
    default: "http://localhost:8080/api/v1/auth/github/callback",
  }),
  JWT_SECRET: str(),
  STELLAR_HORIZON_URL: url(),
  STELLAR_FRIENDBOT_URL: url(),
});
