import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { createCategoryService } from "@/services/category.service";
import { UserInMemoryRepositoryFactory } from "./repository/in-memory/user";
import { UserServiceFactory } from "./services/user.service";

export type AppServices = {
  categoryService: ReturnType<typeof createCategoryService>;
  userService: ReturnType<typeof UserServiceFactory>;
};

export async function createApp() {
  const app = Fastify({
    logger: true,
  });

  // category dependencies
  const categoryRepo = createCategoryInMemoryRepository();
  const categoryService = createCategoryService(categoryRepo);

  // user dependencies
  const userRepo = UserInMemoryRepositoryFactory();
  const userService = UserServiceFactory(userRepo);

  const services: AppServices = {
    categoryService,
    userService,
  };

  await registerRoutes(app, services);

  return app;
}
