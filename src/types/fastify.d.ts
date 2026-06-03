import type { TokenPayloadDTO } from "@/types/auth/dtos";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: TokenPayloadDTO;
  }
}
