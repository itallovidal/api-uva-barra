import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ResponsePayload } from "@/types/api";
import { AppErrorClass } from "@/types/api";
import type { NewsletterEmailService } from "@/services/newsletter-email.service";
import type { NewsletterService } from "@/services/newsletter.service";
import { authMiddleware } from "@/middlewares/auth-middleware";
import {
  emailParamsSchema,
  newsletterParamsSchema,
  createNewsletterSchema,
  updateNewsletterSchema,
  paginationQuerySchema,
} from "@/validation/newsletter";

export async function newsletterAdminController(
  app: FastifyInstance,
  deps: {
    newsletterEmailService: NewsletterEmailService;
    newsletterService: NewsletterService;
  },
): Promise<void> {
  async function listEmailsHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data } = paginationQuerySchema.safeParse(request.query);

    if (!success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Parâmetros de paginação inválidos.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    try {
      const result = await deps.newsletterEmailService.findAll(
        data.page,
        data.perPage,
      );

      reply.code(200);
      const responsePayload: ResponsePayload<typeof result.data> = {
        status: 200,
        data: result.data,
        meta: {
          page: data.page,
          perPage: data.perPage,
          total: result.total,
          totalPages: result.totalPages,
        },
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

  async function getEmailByEmailHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data } = emailParamsSchema.safeParse(request.params);

    if (!success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Email inválido.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    try {
      const newsletterEmail = await deps.newsletterEmailService.findByEmail(
        data.email,
      );

      reply.code(200);
      const responsePayload: ResponsePayload<typeof newsletterEmail> = {
        status: 200,
        data: newsletterEmail,
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

  async function createNewsletterHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data } = createNewsletterSchema.safeParse(request.body);

    if (!success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Conteúdo inválido.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    try {
      const newsletter = await deps.newsletterService.create(data.content);
      reply.code(201);

      const responsePayload: ResponsePayload<typeof newsletter> = {
        status: 201,
        data: newsletter,
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

  async function updateNewsletterHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = newsletterParamsSchema.safeParse(request.params);

    if (!paramsResult.success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID de newsletter inválido.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    const bodyResult = updateNewsletterSchema.safeParse(request.body);

    if (!bodyResult.success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "Conteúdo inválido.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    try {
      const newsletter = await deps.newsletterService.update(
        paramsResult.data.id,
        bodyResult.data.content,
      );

      reply.code(200);
      const responsePayload: ResponsePayload<typeof newsletter> = {
        status: 200,
        data: newsletter,
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

  async function deleteNewsletterHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const paramsResult = newsletterParamsSchema.safeParse(request.params);

    if (!paramsResult.success) {
      reply.code(400);
      const payloadResponse: ResponsePayload<null> = {
        status: 400,
        error: {
          message: "ID de newsletter inválido.",
          code: "VALIDATION_ERROR",
        },
        data: null,
      };
      return payloadResponse;
    }

    try {
      await deps.newsletterService.delete(paramsResult.data.id);
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

  app.get(
    "/newsletter/email",
    { preHandler: [authMiddleware] },
    listEmailsHandler,
  );
  app.get(
    "/newsletter/email/:email",
    { preHandler: [authMiddleware] },
    getEmailByEmailHandler,
  );
  app.post(
    "/newsletter/",
    { preHandler: [authMiddleware] },
    createNewsletterHandler,
  );
  app.put(
    "/newsletter/:id",
    { preHandler: [authMiddleware] },
    updateNewsletterHandler,
  );
  app.delete(
    "/newsletter/:id",
    { preHandler: [authMiddleware] },
    deleteNewsletterHandler,
  );
}
