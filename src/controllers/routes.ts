import type { FastifyInstance } from "fastify";
import type { AppServices } from "@/app";
import { healthcheckController } from "./healthcheck.controller";

export async function registerRoutes(
  app: FastifyInstance,
  deps: AppServices,
): Promise<void> {
  await healthcheckController(app, {});
  // await userController(app, { userService: deps.userService });
}
