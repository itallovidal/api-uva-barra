import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ResponsePayload } from "@/types/api";
import { AppErrorClass } from "@/types/api";
import type { NewsletterEmailService } from "@/services/newsletter-email.service";
import { registerEmailSchema } from "@/validation/newsletter";

export async function newsletterController(
  app: FastifyInstance,
  deps: { newsletterEmailService: NewsletterEmailService },
): Promise<void> {
  async function registerEmailHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { success, data } = registerEmailSchema.safeParse(request.body);

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
      const newsletterEmail = await deps.newsletterEmailService.registerEmail(data.email);
      reply.code(201);

      const responsePayload: ResponsePayload<typeof newsletterEmail> = {
        status: 201,
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

  app.post("/newsletter/register", registerEmailHandler);
}
