import type { UserProfessionType } from "../user/entities";

export const RegistrationRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type RegistrationRequestStatusType =
  (typeof RegistrationRequestStatus)[keyof typeof RegistrationRequestStatus];

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profession: UserProfessionType;
  bio: string | null;
  status: RegistrationRequestStatusType;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
