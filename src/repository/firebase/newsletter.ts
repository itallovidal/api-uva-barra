import type { Newsletter } from "@/types/newsletter/entities";
import type { NewsletterRepository } from "@/repository/newsletter";
import type { Firestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "newsletter";

function deserializeNewsletter(
  id: string,
  data: Record<string, unknown>,
): Newsletter {
  return {
    id,
    content: data.content as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export function NewsletterFirebaseRepositoryFactory(
  db: Firestore,
): NewsletterRepository {
  return {
    async findAll(): Promise<Newsletter[]> {
      const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
      return snapshot.docs.map((doc) =>
        deserializeNewsletter(doc.id, doc.data() as Record<string, unknown>),
      );
    },

    async findById(id: string): Promise<Newsletter | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return deserializeNewsletter(doc.id, doc.data() as Record<string, unknown>);
    },

    async create(input: Newsletter): Promise<Newsletter> {
      await db.collection(COLLECTION).doc(input.id).set(input);
      return input;
    },

    async update(
      id: string,
      input: Partial<Newsletter>,
    ): Promise<Newsletter | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;

      await db.collection(COLLECTION).doc(id).update(input as Record<string, unknown>);
      const updated = await doc.ref.get();
      return deserializeNewsletter(updated.id, updated.data() as Record<string, unknown>);
    },

    async delete(id: string): Promise<boolean> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return false;
      await doc.ref.delete();
      return true;
    },
  };
}
