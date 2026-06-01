import type { FastifyInstance } from "fastify";
import type { ResponsePayload, AppError } from "@/types/api";
import type { CategoryService } from "@/services/category.service";
import type { CreateCategoryRequestDTO } from "@/types/category/dtos";
import { categoryParamsSchema, createCategorySchema } from "@/validation/category";

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
      reply.code(404);
      return {
        status: 404,
        error: error as AppError,
      };
    }
  }

  app.post<{ Body: CreateCategoryRequestDTO }>(
    "/categories",
    createCategoryHandler,
  );

  app.get("/categories", findAllCategoriesHandler);

  app.delete<{ Params: { id: string } }>(
    "/categories/:id",
    deleteCategoryHandler,
  );
}
