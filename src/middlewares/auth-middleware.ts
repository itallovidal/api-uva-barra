import type { FastifyReply, FastifyRequest } from "fastify";
import { AppErrorClass } from "@/types/api";
import { decodeToken } from "@/utils/jwt-handler";
import { Env } from "@/validation/env";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authorization = request.headers.authorization;

  const app = request.server;
  const JWT_SECRET = (app as unknown as { env: Env }).env.JWT_SECRET;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401);
  }

  const token = authorization.slice(7);

  try {
    const payload = decodeToken(token, JWT_SECRET);
    request.user = payload;
  } catch {
    throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401);
  }
}
