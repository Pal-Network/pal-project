import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: url(),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: str(),
  NEXT_PUBLIC_STELLAR_HORIZON_URL: url(),
  NEXT_PUBLIC_STELLAR_FRIENDBOT_URL: url()
});
