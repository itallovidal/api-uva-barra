import Fastify from "fastify";
import { registerRoutes } from "@/controllers/routes";

// TODO: implement this!
import { createUserService } from "@/services/user.service";

export type AppServices = {
  // userService: ReturnType<typeof createUserService>;
};

export async function createApp() {
  const app = Fastify({
    logger: true,
  });

  // Repositories
  // const userRepo = createUserInMemoryRepository();

  // Services
  // const userService = createUserService(userRepo);

  const services: AppServices = {};

  await registerRoutes(app, services);

  return app;
}
