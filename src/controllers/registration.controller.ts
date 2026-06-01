import { RegistrationService } from "@/services/registration.service";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { ResponsePayload, API_ERROR_CODES } from "@/types/api";
import { RegistrationRequestDTO } from "@/types/registration/dtos";
import { RegistrationRequest } from "@/types/registration/entities";
import { User } from "@/types/user/entities";
import {
  approveRegistrationParamsSchema,
  createRegistrationSchema,
  listRegistrationQuerySchema,
  rejectRegistrationBodySchema,
} from "@/validation/user";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function registrationController(
  app: FastifyInstance,
  deps: { registrationService: RegistrationService },
): Promise<void> {
  async function createRegistrationHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data, error } = createRegistrationSchema.safeParse(
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

    const inputData = data as RegistrationRequestDTO;

    try {
      const registrationRequest =
        await deps.registrationService.createRegistrationRequest(inputData);
      reply.code(201);

      const responsePayload: ResponsePayload<RegistrationRequest> = {
        status: 201,
        data: registrationRequest,
      };

      return responsePayload;
    } catch (error: Error | any) {
      console.error("Error in createRegistrationHandler:", error);

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

  async function listRegistrationRequestsHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data, error } = listRegistrationQuerySchema.safeParse(
      request.query,
    );

    if (!success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Parâmetros de consulta inválidos.",
          code: API_ERROR_CODES.Api.InvalidPayloadError,
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      const result = await deps.registrationService.listRegistrationRequests(
        data,
      );

      reply.code(200);

      const responsePayload: ResponsePayload<RegistrationRequest[]> = {
        status: 200,
        data: result.data,
        meta: result.meta,
      };

      return responsePayload;
    } catch (error: Error | any) {
      console.error("Error in listRegistrationRequestsHandler:", error);

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

  async function approveRegistrationHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = approveRegistrationParamsSchema.safeParse(
      request.params,
    );

    if (!paramsResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID da solicitação inválido.",
          code: API_ERROR_CODES.Api.InvalidPayloadError,
        },
        data: null,
      };

      return payloadResponse;
    }

    try {
      const result = await deps.registrationService.approveRegistrationRequest(
        paramsResult.data.id,
        request.user?.sub as string,
      );

      reply.code(200);

      const responsePayload: ResponsePayload<{
        user: User;
        request: RegistrationRequest;
      }> = {
        status: 200,
        data: result,
      };

      return responsePayload;
    } catch (error: Error | any) {
      console.error("Error in approveRegistrationHandler:", error);

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

  async function rejectRegistrationHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = approveRegistrationParamsSchema.safeParse(
      request.params,
    );

    if (!paramsResult.success) {
      reply.code(400);

      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID da solicitação inválido.",
          code: API_ERROR_CODES.Api.InvalidPayloadError,
        },
        data: null,
      };

      return payloadResponse;
    }

    const bodyResult = rejectRegistrationBodySchema.safeParse(request.body);

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
      const updatedRequest =
        await deps.registrationService.rejectRegistrationRequest(
          paramsResult.data.id,
          request.user?.sub as string,
          bodyResult.data.reason ?? undefined,
        );

      reply.code(200);

      const responsePayload: ResponsePayload<RegistrationRequest> = {
        status: 200,
        data: updatedRequest,
      };

      return responsePayload;
    } catch (error: Error | any) {
      console.error("Error in rejectRegistrationHandler:", error);

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

  app.post("/registration/", createRegistrationHandler);
  app.get(
    "/registration/requests",
    { preHandler: [authMiddleware] },
    listRegistrationRequestsHandler,
  );
  app.post(
    "/registration/:id/approve",
    { preHandler: [authMiddleware] },
    approveRegistrationHandler,
  );
  app.post(
    "/registration/:id/reject",
    { preHandler: [authMiddleware] },
    rejectRegistrationHandler,
  );
}
