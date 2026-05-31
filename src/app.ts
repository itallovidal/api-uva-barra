import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { RegistrationRequestInMemoryRepositoryFactory } from "@/repository/in-memory/registration-request";
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
  const registrationRequestRepo =
    RegistrationRequestInMemoryRepositoryFactory();
  const userService = UserServiceFactory(userRepo, registrationRequestRepo);

  const services: AppServices = {
    categoryService,
    userService,
  };

  await registerRoutes(app, services);

  return app;
}
