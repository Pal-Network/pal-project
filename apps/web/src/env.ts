import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: url({ default: "http://localhost:8080" }),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: str({ default: "" }),
  NEXT_PUBLIC_STELLAR_HORIZON_URL: url({
    default: "https://horizon-testnet.stellar.org",
  }),
  NEXT_PUBLIC_STELLAR_FRIENDBOT_URL: url({
    default: "https://friendbot.stellar.org",
  }),
});
