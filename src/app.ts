import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { createCategoryService } from "@/services/category.service";

export type AppServices = {
  categoryService: ReturnType<typeof createCategoryService>;
};

export async function createApp() {
  const app = Fastify({
    logger: true,
  });

  const categoryRepo = createCategoryInMemoryRepository();
  const categoryService = createCategoryService(categoryRepo);

  const services: AppServices = {
    categoryService,
  };

  await registerRoutes(app, services);

  return app;
}
