import { Horizon } from "@stellar/stellar-sdk";
import { env } from "./env";

export const stellarServer = new Horizon.Server(env.STELLAR_HORIZON_URL);
