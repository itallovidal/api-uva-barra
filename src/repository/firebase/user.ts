import { User } from "@/types/user/entities";
import { UserRepository } from "../user";
import type { Firestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "users";

function deserializeUser(id: string, data: Record<string, unknown>): User {
  return {
    id,
    name: data.name as string,
    email: data.email as string,
    password: data.password as string,
    avatarUrl: (data.avatarUrl as string | null) ?? null,
    role: data.role as User["role"],
    profession: data.profession as User["profession"],
    bio: (data.bio as string | null) ?? null,
    status: data.status as User["status"],
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

export function UserFirebaseRepositoryFactory(
  db: Firestore,
): UserRepository {
  return {
    async findById(id: string): Promise<User | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return deserializeUser(doc.id, doc.data() as Record<string, unknown>);
    },

    async findByEmail(email: string): Promise<User | null> {
      const snapshot = await db
        .collection(COLLECTION)
        .where("email", "==", email)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return deserializeUser(doc.id, doc.data() as Record<string, unknown>);
    },

    async findAll(): Promise<User[]> {
      const snapshot = await db.collection(COLLECTION).get();

      return snapshot.docs.map((doc) =>
        deserializeUser(doc.id, doc.data() as Record<string, unknown>),
      );
    },

    async create(input: User): Promise<User> {
      await db.collection(COLLECTION).doc(input.id).set(input);
      return input;
    },

    async update(
      id: string,
      input: Partial<User>,
    ): Promise<User | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;

      await db.collection(COLLECTION).doc(id).update(input as Record<string, unknown>);
      const updated = await doc.ref.get();
      return deserializeUser(updated.id, updated.data() as Record<string, unknown>);
    },

    async delete(id: string): Promise<boolean> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return false;
      await doc.ref.delete();
      return true;
    },
  };
}
