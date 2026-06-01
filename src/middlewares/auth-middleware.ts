import type { FastifyReply, FastifyRequest } from "fastify";
import { API_ERROR_CODES } from "@/types/api";
import { decodeToken } from "@/utils/jwt-handler";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    reply.code(401).send({
      status: 401,
      error: {
        message: "Não autorizado.",
        code: API_ERROR_CODES.Api.InvalidCredentialsError,
      },
    });
    return;
  }

  const token = authorization.slice(7);

  try {
    const payload = decodeToken(token);
    request.user = payload;
  } catch {
    reply.code(401).send({
      status: 401,
      error: {
        message: "Não autorizado.",
        code: API_ERROR_CODES.Api.InvalidCredentialsError,
      },
    });
  }
}
