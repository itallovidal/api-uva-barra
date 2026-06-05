import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryService } from "@/services/category.service";
import { createNewsService } from "@/services/news.service";
import { createCacheService } from "@/services/cache.service";
import { RegistrationServiceFactory } from "@/services/registration.service";
import { UserServiceFactory } from "@/services/user.service";
import { initFirebase } from "@/lib/firebase";
import {
  UserFirebaseRepositoryFactory,
  CategoryFirebaseRepositoryFactory,
  NewsFirebaseRepositoryFactory,
  RegistrationRequestFirebaseRepositoryFactory,
} from "@/repository/firebase";
import { AppErrorClass } from "@/types/api";
import { validateEnv } from "./validation/env";
import cors from "@fastify/cors";

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

  await app.register(cors, {
    origin: "*",
  });

  const env = validateEnv(process.env);
  app.decorate("env", env);
  console.log("Environment variables validated successfully.");

  const db = initFirebase(env);
  console.log("Firebase initialized successfully.");

  // category dependencies
  const categoryRepo = CategoryFirebaseRepositoryFactory(db);
  const categoryService = createCategoryService(categoryRepo);

  // cache dependency
  const cacheService = createCacheService();

  // news dependencies
  const newsRepo = NewsFirebaseRepositoryFactory(db);
  await cacheService.warmUpNewsIndex(newsRepo);
  const newsService = createNewsService(newsRepo, cacheService);

  // user dependencies
  const userRepo = UserFirebaseRepositoryFactory(db);
  const registrationRequestRepo =
    RegistrationRequestFirebaseRepositoryFactory(db);

  const registrationService = RegistrationServiceFactory(
    registrationRequestRepo,
    userRepo,
  );

  const userService = UserServiceFactory(userRepo, env.JWT_SECRET);

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

  return {
    app,
    env,
  };
}
