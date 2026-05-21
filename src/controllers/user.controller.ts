import type { FastifyInstance } from "fastify";

export async function userController(
  app: FastifyInstance,
  deps: any, // TODO: Define proper type for dependencies: use AppServices from "@/app"
): Promise<void> {
  // TODO: Implement user routes
}
