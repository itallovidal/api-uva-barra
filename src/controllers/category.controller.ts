import type { FastifyInstance } from "fastify";
import type { ResponsePayload } from "@/types/api";
import { AppErrorClass } from "@/types/api";
import type { CategoryService } from "@/services/category.service";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from "@/validation/category";

export async function categoryController(
  app: FastifyInstance,
  deps: { categoryService: CategoryService },
): Promise<void> {
  async function createCategoryHandler(
    request: { body: CreateCategoryRequestDTO },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = createCategorySchema.safeParse(request.body);
    if (!parsed.success) {
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

    const category = await deps.categoryService.create(parsed.data);
    reply.code(201);
    return { status: 201, data: category };
  }

  async function findAllCategoriesHandler(): Promise<ResponsePayload> {
    const categories = await deps.categoryService.findAll();
    return {
      status: 200,
      data: categories,
    };
  }

  async function findCategoryByIdHandler(
    request: { params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = categoryParamsSchema.safeParse(request.params);
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
      const category = await deps.categoryService.findById(parsed.data.id);
      return { status: 200, data: category };
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

  async function updateCategoryHandler(
    request: { body: UpdateCategoryRequestDTO; params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const paramsParsed = categoryParamsSchema.safeParse(request.params);
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

    const bodyParsed = updateCategorySchema.safeParse(request.body);
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
      const category = await deps.categoryService.update(paramsParsed.data.id, bodyParsed.data);
      return { status: 200, data: category };
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

  async function deleteCategoryHandler(
    request: { params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const parsed = categoryParamsSchema.safeParse(request.params);
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
      await deps.categoryService.delete(parsed.data.id);
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

  app.post<{ Body: CreateCategoryRequestDTO }>(
    "/categories",
    createCategoryHandler,
  );

  app.get("/categories", findAllCategoriesHandler);

  app.get<{ Params: { id: string } }>(
    "/categories/:id",
    findCategoryByIdHandler,
  );

  app.put<{ Body: UpdateCategoryRequestDTO; Params: { id: string } }>(
    "/categories/:id",
    updateCategoryHandler,
  );

  app.delete<{ Params: { id: string } }>(
    "/categories/:id",
    deleteCategoryHandler,
  );
}
