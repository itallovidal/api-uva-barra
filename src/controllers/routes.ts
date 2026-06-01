import type { FastifyInstance } from "fastify";
import type { AppServices } from "@/app";
import { categoryController } from "./category.controller";
import { healthcheckController } from "./healthcheck.controller";
import { newsController } from "./news.controller";
import { registrationController } from "./registration.controller";
import { userController } from "./user.controller";

export async function registerRoutes(
  app: FastifyInstance,
  deps: AppServices,
): Promise<void> {
  await healthcheckController(app, {});
  await categoryController(app, { categoryService: deps.categoryService });
  await newsController(app, { newsService: deps.newsService });

  await registrationController(app, {
    registrationService: deps.registrationService,
  });
  await userController(app, { userService: deps.userService });
}
