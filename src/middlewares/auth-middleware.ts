import type { FastifyReply, FastifyRequest } from "fastify";
import { AppErrorClass } from "@/types/api";
import { decodeToken } from "@/utils/jwt-handler";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401);
  }

  const token = authorization.slice(7);

  try {
    const payload = decodeToken(token);
    request.user = payload;
  } catch {
    throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401);
  }
}
