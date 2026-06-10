import type { NewsletterEmail } from "@/types/newsletter/entities";
import type { NewsletterEmailRepository } from "@/repository/newsletter-email";
import type { Firestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "newsletter-emails";

function deserializeNewsletterEmail(
  id: string,
  data: Record<string, unknown>,
): NewsletterEmail {
  return {
    id,
    email: data.email as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export function NewsletterEmailFirebaseRepositoryFactory(
  db: Firestore,
): NewsletterEmailRepository {
  return {
    async findAll(
      limit: number,
      offset: number,
    ): Promise<{ data: NewsletterEmail[]; total: number }> {
      const totalSnapshot = await db.collection(COLLECTION).count().get();
      const total = totalSnapshot.data().count;

      const snapshot = await db
        .collection(COLLECTION)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset(offset)
        .get();

      const data = snapshot.docs.map((doc) =>
        deserializeNewsletterEmail(doc.id, doc.data() as Record<string, unknown>),
      );

      return { data, total };
    },

    async findByEmail(email: string): Promise<NewsletterEmail | null> {
      const snapshot = await db
        .collection(COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return deserializeNewsletterEmail(doc.id, doc.data() as Record<string, unknown>);
    },

    async findById(id: string): Promise<NewsletterEmail | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return deserializeNewsletterEmail(doc.id, doc.data() as Record<string, unknown>);
    },

    async exists(email: string): Promise<boolean> {
      const snapshot = await db
        .collection(COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .get();
      return !snapshot.empty;
    },

    async create(input: NewsletterEmail): Promise<NewsletterEmail> {
      await db.collection(COLLECTION).doc(input.id).set(input);
      return input;
    },

    async delete(id: string): Promise<boolean> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return false;
      await doc.ref.delete();
      return true;
    },
  };
}
