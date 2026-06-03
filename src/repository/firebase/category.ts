import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";
import type { Firestore } from "firebase-admin/firestore";

const COLLECTION = "categories";

export function CategoryFirebaseRepositoryFactory(
  db: Firestore,
): CategoryRepository {
  return {
    async findAll(): Promise<Category[]> {
      const snapshot = await db.collection(COLLECTION).get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string,
        tags: doc.data().tags as string[],
      }));
    },

    async findById(id: string): Promise<Category | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return {
        id: doc.id,
        name: doc.data()!.name as string,
        tags: doc.data()!.tags as string[],
      };
    },

    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      const id = crypto.randomUUID();
      const category: Category = {
        id,
        name: input.name,
        tags: input.tags ?? [],
      };
      await db.collection(COLLECTION).doc(id).set(category);
      return category;
    },

    async update(id: string, input: UpdateCategoryRequestDTO): Promise<Category | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;

      const updated: Category = {
        id,
        name: input.name,
        tags: input.tags,
      };
      await db.collection(COLLECTION).doc(id).set(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return false;
      await doc.ref.delete();
      return true;
    },
  };
}
