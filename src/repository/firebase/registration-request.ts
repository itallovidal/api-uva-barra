import type { RegistrationRequestListQuery } from "@/types/registration/dtos";
import type { RegistrationRequest } from "@/types/registration/entities";
import type { RegistrationRequestRepository } from "../registration-request";
import { AppErrorClass } from "@/types/api";
import type { Firestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "registration-requests";

function deserializeRegistrationRequest(
  id: string,
  data: Record<string, unknown>,
): RegistrationRequest {
  return {
    id,
    name: data.name as string,
    email: data.email as string,
    passwordHash: data.passwordHash as string,
    profession: data.profession as RegistrationRequest["profession"],
    bio: (data.bio as string | null) ?? null,
    status: data.status as RegistrationRequest["status"],
    reviewedBy: (data.reviewedBy as string | null) ?? null,
    reviewedAt: data.reviewedAt
      ? (data.reviewedAt as Timestamp).toDate()
      : null,
    rejectionReason: (data.rejectionReason as string | null) ?? null,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

export function RegistrationRequestFirebaseRepositoryFactory(
  db: Firestore,
): RegistrationRequestRepository {
  return {
    async createRequest(
      data: RegistrationRequest,
    ): Promise<RegistrationRequest> {
      await db.collection(COLLECTION).doc(data.id).set(data);
      return data;
    },

    async findById(id: string): Promise<RegistrationRequest | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return deserializeRegistrationRequest(
        doc.id,
        doc.data() as Record<string, unknown>,
      );
    },

    async findByEmail(email: string): Promise<RegistrationRequest | null> {
      const snapshot = await db
        .collection(COLLECTION)
        .where("email", "==", email)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return deserializeRegistrationRequest(
        doc.id,
        doc.data() as Record<string, unknown>,
      );
    },

    async listRequests(
      query?: RegistrationRequestListQuery,
    ): Promise<RegistrationRequest[]> {
      let fbQuery = db
        .collection(COLLECTION)
        .orderBy("createdAt", "desc") as FirebaseFirestore.Query;

      if (query?.status) {
        fbQuery = fbQuery.where("status", "==", query.status);
      }

      const snapshot = await fbQuery.get();
      return snapshot.docs.map((doc) =>
        deserializeRegistrationRequest(
          doc.id,
          doc.data() as Record<string, unknown>,
        ),
      );
    },

    async updateRequest(
      id: string,
      patch: Partial<RegistrationRequest>,
    ): Promise<RegistrationRequest> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) {
        throw new AppErrorClass(
          "Registration request not found",
          "NOT_FOUND",
          404,
        );
      }

      const existing = deserializeRegistrationRequest(
        doc.id,
        doc.data() as Record<string, unknown>,
      );
      const updated = { ...existing, ...patch, updatedAt: new Date() };
      await db.collection(COLLECTION).doc(id).set(updated);
      return updated;
    },
  };
}
