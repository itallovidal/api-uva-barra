import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ResponsePayload } from "@/types/api";
import { AppErrorClass } from "@/types/api";
import type { NewsService } from "@/services/news.service";
import type { CreateNewsDTO } from "@/types/news/dtos";
import { authMiddleware } from "@/middlewares/auth-middleware";
import {
  createNewsSchema,
  updateNewsSchema,
  newsParamsSchema,
  latestNewsQuerySchema,
  newsSlugSchema,
  newsSearchQuerySchema,
} from "@/validation/news";

export async function newsController(
  app: FastifyInstance,
  deps: { newsService: NewsService },
): Promise<void> {
  async function createNewsHandler(
    request: { body: CreateNewsDTO },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = createNewsSchema.safeParse(request.body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.format());

      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "Dados inválidos",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const news = await deps.newsService.create(parsed.data);
    reply.code(201);
    return { status: 201, data: news };
  }

  async function findNewsByIdHandler(
    request: { params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = newsParamsSchema.safeParse(request.params);
    if (!parsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "ID inválido",
          code: "VALIDATION_ERROR",
        },
      };
    }

    try {
      const news = await deps.newsService.findById(parsed.data.id);
      return { status: 200, data: news };
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

  async function findNewsBySlugHandler(
    request: { params: { slug: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = newsSlugSchema.safeParse(request.params);
    if (!parsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "Slug inválido",
          code: "VALIDATION_ERROR",
        },
      };
    }

    try {
      const news = await deps.newsService.findBySlug(parsed.data.slug);
      return { status: 200, data: news };
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

  async function updateNewsHandler(
    request: { params: { id: string }; body: Partial<CreateNewsDTO> },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const paramsParsed = newsParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "ID inválido",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const bodyParsed = updateNewsSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "Dados inválidos",
          code: "VALIDATION_ERROR",
        },
      };
    }

    try {
      const news = await deps.newsService.update(
        paramsParsed.data.id,
        bodyParsed.data,
      );
      return { status: 200, data: news };
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

  async function deleteNewsHandler(
    request: { params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = newsParamsSchema.safeParse(request.params);
    if (!parsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "ID inválido",
          code: "VALIDATION_ERROR",
        },
      };
    }

    try {
      await deps.newsService.delete(parsed.data.id);
      reply.code(204);
      return { status: 204 };
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

  async function findLatestNewsHandler(
    request: FastifyRequest<{
      Querystring: { page?: string; perPage?: string };
    }>,
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    console.log("findLatestNewsHandler");

    const { success, data, error } = latestNewsQuerySchema.safeParse(
      request.query,
    );

    if (!success) {
      console.error("Validation error:", error.format());
    }

    const { page, perPage } = success ? data : { page: 1, perPage: 10 };

    const result = await deps.newsService.findLatest({ page, perPage });
    return {
      status: 200,
      data: result.items,
      meta: {
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async function findLatestNewsByCategoryHandler(
    request: FastifyRequest<{
      Params: { category: string };
      Querystring: { page?: string; perPage?: string };
    }>,
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = latestNewsQuerySchema.safeParse(request.query);

    console.log("findLatestNewsByCategoryHandler - query validation", {
      success: parsed.success,
      error: parsed.success ? null : parsed.error.format(),
      data: parsed.data,
      category: request.params.category,
    });

    const { page, perPage } = parsed.success
      ? parsed.data
      : { page: 1, perPage: 10 };

    const result = await deps.newsService.findLatest({
      page,
      perPage,
      category: request.params.category,
    });
    return {
      status: 200,
      data: result.items,
      meta: {
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async function searchNewsHandler(
    request: FastifyRequest<{
      Querystring: { q: string; order?: string; page?: string; perPage?: string };
    }>,
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = newsSearchQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      reply.code(400);
      return {
        status: 400,
        data: null,
        error: {
          message: "Parâmetros de busca inválidos",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const result = await deps.newsService.search(parsed.data);
    return {
      status: 200,
      data: result.items,
      meta: {
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  app.post<{ Body: CreateNewsDTO }>(
    "/news",
    { preHandler: [authMiddleware] },
    createNewsHandler,
  );

  app.get<{
    Querystring: { q: string; order?: string; page?: string; perPage?: string };
  }>("/news/search", searchNewsHandler);

  app.get<{ Params: { id: string } }>("/news/:id", findNewsByIdHandler);

  app.get<{ Params: { slug: string } }>(
    "/news/slug/:slug",
    findNewsBySlugHandler,
  );

  app.put<{ Params: { id: string }; Body: Partial<CreateNewsDTO> }>(
    "/news/:id",
    { preHandler: [authMiddleware] },
    updateNewsHandler,
  );

  app.delete<{ Params: { id: string } }>(
    "/news/:id",
    { preHandler: [authMiddleware] },
    deleteNewsHandler,
  );

  app.get<{ Querystring: { page?: string; perPage?: string } }>(
    "/news",
    findLatestNewsHandler,
  );

  app.get<{
    Params: { category: string };
    Querystring: { page?: string; perPage?: string };
  }>("/news/category/:category", findLatestNewsByCategoryHandler);
}
