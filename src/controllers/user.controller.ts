import { UserService } from "@/services/user.service";
import { adminMiddleware } from "@/shared/middlewares";
import { ResponsePayload } from "@/shared/types";
import { API_ERROR_CODES } from "@/shared/types/response";
import { CreateUserDTO } from "@/types/user/dtos";
import { User } from "@/types/user/entities";
import {
  createUserSchema,
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
    const { success, data, error } = createUserSchema.safeParse(
      request.body,
    );

    if (!success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Dados inválidos, verifique e envie novamente.",
          code: API_ERROR_CODES.Api.InvalidPayloadError,
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
    } catch (error: Error | any) {
      console.error("Error in createUserHandler:", error);

      if (error instanceof Error) {
        const cause = error.cause as {
          code: string;
          message: string;
          status: number;
        };

        reply.code(cause.status);

        const payloadResponse: ResponsePayload<null> = {
          status: cause.status,
          error: {
            message: cause.message,
            code: cause.code,
          },
          data: null,
        };

        return payloadResponse;
      }

      reply.code(500);
      return {
        status: 500,
        error: {
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
          code: API_ERROR_CODES.Api.UnknownError,
        },
        data: null,
      };
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
          code: API_ERROR_CODES.Api.InvalidPayloadError,
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
    } catch (error: Error | any) {
      console.error("Error in getUserByIdHandler:", error);

      if (error instanceof Error) {
        const cause = error.cause as {
          code: string;
          message: string;
          status: number;
        };

        reply.code(cause.status);

        const payloadResponse: ResponsePayload<null> = {
          status: cause.status,
          error: {
            message: cause.message,
            code: cause.code,
          },
          data: null,
        };

        return payloadResponse;
      }

      reply.code(500);
      return {
        status: 500,
        error: {
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
          code: API_ERROR_CODES.Api.UnknownError,
        },
        data: null,
      };
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
    } catch (error: Error | any) {
      console.error("Error in getUserByEmailHandler:", error);

      if (error instanceof Error) {
        const cause = error.cause as {
          code: string;
          message: string;
          status: number;
        };

        reply.code(cause.status);

        const payloadResponse: ResponsePayload<null> = {
          status: cause.status,
          error: {
            message: cause.message,
            code: cause.code,
          },
          data: null,
        };

        return payloadResponse;
      }

      reply.code(500);
      return {
        status: 500,
        error: {
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
          code: API_ERROR_CODES.Api.UnknownError,
        },
        data: null,
      };
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
          code: API_ERROR_CODES.Api.InvalidPayloadError,
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
          code: API_ERROR_CODES.Api.InvalidPayloadError,
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
    } catch (error: Error | any) {
      console.error("Error in updateUserHandler:", error);

      if (error instanceof Error) {
        const cause = error.cause as {
          code: string;
          message: string;
          status: number;
        };

        reply.code(cause.status);

        const payloadResponse: ResponsePayload<null> = {
          status: cause.status,
          error: {
            message: cause.message,
            code: cause.code,
          },
          data: null,
        };

        return payloadResponse;
      }

      reply.code(500);
      return {
        status: 500,
        error: {
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
          code: API_ERROR_CODES.Api.UnknownError,
        },
        data: null,
      };
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
          code: API_ERROR_CODES.Api.InvalidPayloadError,
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      await deps.userService.deleteUser(paramsResult.data.id);
      reply.code(204);

      return;
    } catch (error: Error | any) {
      console.error("Error in deleteUserHandler:", error);

      if (error instanceof Error) {
        const cause = error.cause as {
          code: string;
          message: string;
          status: number;
        };

        reply.code(cause.status);

        const payloadResponse: ResponsePayload<null> = {
          status: cause.status,
          error: {
            message: cause.message,
            code: cause.code,
          },
          data: null,
        };

        return payloadResponse;
      }

      reply.code(500);
      return {
        status: 500,
        error: {
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
          code: API_ERROR_CODES.Api.UnknownError,
        },
        data: null,
      };
    }
  }

  app.post(
    "/user/",
    { preHandler: [adminMiddleware] },
    createUserHandler,
  );
  app.get(
    "/user/:id",
    { preHandler: [adminMiddleware] },
    getUserByIdHandler,
  );
  app.get(
    "/user/email/:email",
    { preHandler: [adminMiddleware] },
    getUserByEmailHandler,
  );
  app.put(
    "/user/:id",
    { preHandler: [adminMiddleware] },
    updateUserHandler,
  );
  app.delete(
    "/user/:id",
    { preHandler: [adminMiddleware] },
    deleteUserHandler,
  );
}
