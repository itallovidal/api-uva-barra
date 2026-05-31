import type { FastifyReply, FastifyRequest } from "fastify";

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const adminId = request.headers["admin-id"] as string | undefined;

  if (!adminId) {
    reply.code(401);

    reply.send({
      status: 401,
      error: {
        message: "Autenticação necessária.",
        code: "UNAUTHORIZED",
      },
      data: null,
    });

    return;
  }
}
