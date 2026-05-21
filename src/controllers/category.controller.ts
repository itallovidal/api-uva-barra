import type { FastifyInstance } from "fastify";
import type { ResponsePayload, AppError } from "@/shared/types";
import type { CategoryService } from "@/services/category.service";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

export async function categoryController(
  app: FastifyInstance,
  deps: { categoryService: CategoryService },
): Promise<void> {
  async function createCategoryHandler(
    request: { body: CreateCategoryRequest },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    const category = await deps.categoryService.create(request.body);
    reply.code(201);
    return {
      status: 201,
      data: category,
    };
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
    try {
      const category = await deps.categoryService.findById(request.params.id);
      return {
        status: 200,
        data: category,
      };
    } catch (error: unknown) {
      reply.code(404);
      return {
        status: 404,
        error: error as AppError,
      };
    }
  }

  async function updateCategoryHandler(
    request: { params: { id: string }; body: UpdateCategoryRequest },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    try {
      const category = await deps.categoryService.update(request.params.id, request.body);
      return {
        status: 200,
        data: category,
      };
    } catch (error: unknown) {
      reply.code(404);
      return {
        status: 404,
        error: error as AppError,
      };
    }
  }

  async function deleteCategoryHandler(
    request: { params: { id: string } },
    reply: { code: (status: number) => void },
  ): Promise<ResponsePayload> {
    try {
      await deps.categoryService.delete(request.params.id);
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

  app.post<{ Body: CreateCategoryRequest }>(
    "/categories",
    createCategoryHandler,
  );

  app.get("/categories", findAllCategoriesHandler);

  app.get<{ Params: { id: string } }>(
    "/categories/:id",
    findCategoryByIdHandler,
  );

  app.put<{ Params: { id: string }; Body: UpdateCategoryRequest }>(
    "/categories/:id",
    updateCategoryHandler,
  );

  app.delete<{ Params: { id: string } }>(
    "/categories/:id",
    deleteCategoryHandler,
  );
}
