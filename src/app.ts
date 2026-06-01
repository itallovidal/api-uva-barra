import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { RegistrationRequestInMemoryRepositoryFactory } from "@/repository/in-memory/registration-request";
import { createCategoryService } from "@/services/category.service";
import { RegistrationServiceFactory } from "@/services/registration.service";
import { UserServiceFactory } from "@/services/user.service";
import { UserInMemoryRepositoryFactory } from "./repository/in-memory/user";

export type AppServices = {
  categoryService: ReturnType<typeof createCategoryService>;
  registrationService: ReturnType<typeof RegistrationServiceFactory>;
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

  const registrationService = RegistrationServiceFactory(
    registrationRequestRepo,
    userRepo,
  );
  const userService = UserServiceFactory(userRepo);

  const services: AppServices = {
    categoryService,
    registrationService,
    userService,
  };

  await registerRoutes(app, services);

  return app;
}
