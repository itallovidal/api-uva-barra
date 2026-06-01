import type {
  UserProfessionType,
} from "../user/entities";
import type {
  RegistrationRequestStatusType,
} from "./entities";

export interface RegistrationRequestDTO {
  name: string;
  email: string;
  password: string;
  profession: UserProfessionType;
  bio?: string | null;
}

export interface RegistrationRequestResponse {
  id: string;
  name: string;
  email: string;
  profession: UserProfessionType;
  bio: string | null;
  status: RegistrationRequestStatusType;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationRequestListQuery {
  status?: RegistrationRequestStatusType;
  page?: number;
  perPage?: number;
}

export interface ApproveRegistrationDTO {
  adminId: string;
}

export interface RejectRegistrationDTO {
  adminId: string;
  reason?: string;
}
