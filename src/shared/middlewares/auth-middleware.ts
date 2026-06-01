import type { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "@/utils/jwt-handler";
import { API_ERROR_CODES } from "@/shared/types/response";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.code(401);

    reply.send({
      status: 401,
      error: {
        message: "Autenticação necessária.",
        code: API_ERROR_CODES.Api.InvalidCredentialsError,
      },
      data: null,
    });

    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    reply.code(401);

    reply.send({
      status: 401,
      error: {
        message: "Formato de autenticação inválido.",
        code: API_ERROR_CODES.Api.InvalidCredentialsError,
      },
      data: null,
    });

    return;
  }

  const token = parts[1];

  try {
    const decoded = decodeToken(token);

    request.user = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    reply.code(401);

    reply.send({
      status: 401,
      error: {
        message: "Token inválido ou expirado.",
        code: API_ERROR_CODES.Api.InvalidCredentialsError,
      },
      data: null,
    });

    return;
  }
}
