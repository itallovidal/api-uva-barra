import type { TokenPayloadDTO } from "@/types/auth/dtos";

declare module "fastify" {
  interface FastifyRequest {
    user?: TokenPayloadDTO;
  }
}
