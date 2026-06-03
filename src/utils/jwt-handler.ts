import jwt from "jsonwebtoken";
import type { TokenPayloadDTO } from "@/types/auth/dtos";

function generateToken(payload: TokenPayloadDTO, JWT_SECRET: string): string {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  return accessToken;
}

function decodeToken(token: string, JWT_SECRET: string): TokenPayloadDTO {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayloadDTO;
  return decoded;
}

export { generateToken, decodeToken };
