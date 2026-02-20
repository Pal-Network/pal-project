import "dotenv/config";
import { Keypair } from "@stellar/stellar-sdk";
import { env } from "../src/config/env";

async function fundTestnetWallet() {
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secret = keypair.secret();

  const friendbotUrl = new URL(env.STELLAR_FRIENDBOT_URL);
  friendbotUrl.searchParams.set("addr", publicKey);

  const response = await fetch(friendbotUrl.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Friendbot failed: ${response.status} ${body}`);
  }

  console.log("Funded testnet wallet:");
  console.log(`PUBLIC_KEY=${publicKey}`);
  console.log(`SECRET_KEY=${secret}`);
}

fundTestnetWallet().catch((error) => {
  console.error(error);
  process.exit(1);
});
