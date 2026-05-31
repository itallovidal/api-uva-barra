import { UserService } from "@/services/user.service";
import { ResponsePayload } from "@/shared/types";
import { API_ERROR_CODES } from "@/shared/types/response";
import { UserRequestDTO } from "@/types/dto";
import { User } from "@/types/entities";
import { userRegisterRequest } from "@/validation/user";
import type { FastifyInstance } from "fastify";

export async function userController(
  app: FastifyInstance,
  deps: { userService: UserService },
): Promise<void> {
  async function registerRequestHandler(
    request: { body: unknown },
    reply: { code: (status: number) => void },
  ) {
    const { success, data, error } = userRegisterRequest.safeParse(
      request.body,
    );

    console.log("Validation result for registerRequestHandler:", {
      success,
      error: error ? error.format() : null,
    });

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

    const inputData = data as UserRequestDTO;

    try {
      const user = await deps.userService.registerRequest(inputData);
      reply.code(201);

      const responsePayload: ResponsePayload<User> = {
        status: 201,
        data: user,
      };

      return responsePayload;
    } catch (error: Error | any) {
      console.error("Error in registerRequestHandler:", error);

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

  app.post("/user/register", registerRequestHandler);
}
