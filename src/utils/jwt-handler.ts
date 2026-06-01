import jwt from "jsonwebtoken";
import { getEnv } from "@/validation/env";
import type { TokenPayloadDTO } from "@/types/auth/dtos";

function generateToken(payload: TokenPayloadDTO): string {
  const env = getEnv();
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
  return accessToken;
}

function decodeToken(token: string): TokenPayloadDTO {
  const env = getEnv();
  const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayloadDTO;
  return decoded;
}

export { generateToken, decodeToken };
