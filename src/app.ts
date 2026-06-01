import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { createNewsInMemoryRepository } from "@/repository/in-memory/news";
import { RegistrationRequestInMemoryRepositoryFactory } from "@/repository/in-memory/registration-request";
import { createCategoryService } from "@/services/category.service";
import { createNewsService } from "@/services/news.service";
import { RegistrationServiceFactory } from "@/services/registration.service";
import { UserServiceFactory } from "@/services/user.service";
import { UserInMemoryRepositoryFactory } from "./repository/in-memory/user";
import { AppErrorClass } from "@/types/api";

export type AppServices = {
  categoryService: ReturnType<typeof createCategoryService>;
  newsService: ReturnType<typeof createNewsService>;
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

  // news dependencies
  const newsRepo = createNewsInMemoryRepository();
  const newsService = createNewsService(newsRepo);

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
    newsService,
    registrationService,
    userService,
  };

  await registerRoutes(app, services);

  app.setErrorHandler(function errorHandler(error, _request, reply) {
    if (error instanceof AppErrorClass) {
      return reply.code(error.statusCode).send({
        status: error.statusCode,
        error: { message: error.message, code: error.code },
        data: null,
      });
    }

    app.log.error(error);
    return reply.code(500).send({
      status: 500,
      error: {
        message: "Algo de errado aconteceu, tente novamente mais tarde.",
        code: "INTERNAL_ERROR",
      },
      data: null,
    });
  });

  return app;
}
