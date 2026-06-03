import { UserService } from "@/services/user.service";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ResponsePayload, AppErrorClass } from "@/types/api";
import { CreateUserDTO } from "@/types/user/dtos";
import { User } from "@/types/user/entities";
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
  userParamsSchema,
} from "@/validation/user";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function userController(
  app: FastifyInstance,
  deps: { userService: UserService },
): Promise<void> {
  async function createUserHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data, error } = createUserSchema.safeParse(request.body);

    if (!success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Dados inválidos, verifique e envie novamente.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    const inputData = data as CreateUserDTO;

    try {
      const user = await deps.userService.createUser(inputData);
      reply.code(201);

      const responsePayload: ResponsePayload<User> = {
        status: 201,
        data: user,
      };

      return responsePayload;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  async function getUserByIdHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = userParamsSchema.safeParse(request.params);

    if (!paramsResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID de usuário inválido.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      const user = await deps.userService.getUserById(paramsResult.data.id);
      reply.code(200);

      const responsePayload: ResponsePayload<User> = {
        status: 200,
        data: user,
      };

      return responsePayload;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  async function getUserByEmailHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { email } = request.params as { email: string };

    try {
      const user = await deps.userService.getUserByEmail(email);
      reply.code(200);

      const responsePayload: ResponsePayload<User> = {
        status: 200,
        data: user,
      };

      return responsePayload;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  async function updateUserHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = userParamsSchema.safeParse(request.params);

    if (!paramsResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID de usuário inválido.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    const bodyResult = updateUserSchema.safeParse(request.body);

    if (!bodyResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Dados inválidos.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      const user = await deps.userService.updateUser(
        paramsResult.data.id,
        bodyResult.data as Partial<Omit<User, "id">>,
      );
      reply.code(200);

      const responsePayload: ResponsePayload<User> = {
        status: 200,
        data: user,
      };

      return responsePayload;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
    const { success, data, error } = loginSchema.safeParse(request.body);

    if (!success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Dados inválidos, verifique e envie novamente.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      const result = await deps.userService.login(data.email, data.password);
      reply.code(200);

      const responsePayload: ResponsePayload<typeof result> = {
        status: 200,
        data: result,
      };

      return responsePayload;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  async function deleteUserHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = userParamsSchema.safeParse(request.params);

    if (!paramsResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID de usuário inválido.",
          code: "INVALID_PAYLOAD",
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      await deps.userService.deleteUser(paramsResult.data.id);
      reply.code(204);

      return;
    } catch (error: unknown) {
      if (error instanceof AppErrorClass) {
        reply.code(error.statusCode);
        return {
          status: error.statusCode,
          error: { message: error.message, code: error.code },
          data: null,
        };
      }

      throw error;
    }
  }

  app.post("/user/login", loginHandler);
  app.post("/user/", { preHandler: [authMiddleware] }, createUserHandler);
  app.get("/user/:id", { preHandler: [authMiddleware] }, getUserByIdHandler);
  app.get(
    "/user/email/:email",
    { preHandler: [authMiddleware] },
    getUserByEmailHandler,
  );
  app.put("/user/:id", { preHandler: [authMiddleware] }, updateUserHandler);
  app.delete("/user/:id", { preHandler: [authMiddleware] }, deleteUserHandler);
}
