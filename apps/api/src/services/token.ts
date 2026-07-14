import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthTokenPayload {
  sub: string;
}

export function signAuthToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies AuthTokenPayload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
