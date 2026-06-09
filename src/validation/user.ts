import { UserProfession, UserProfessionType } from "@/types/user/entities";
import { z } from "zod";

export const createRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profession: z.string().refine(
    (val) => {
      const value = UserProfession[val.toUpperCase() as UserProfessionType];
      return value !== undefined;
    },
    {
      message: `Profession must be one of: ${Object.values(UserProfession).join(", ")}`,
    },
  ),
  bio: z.string().optional().nullable(),
});

export const listRegistrationQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(10),
});

export const approveRegistrationParamsSchema = z.object({
  id: z.string().uuid("Invalid registration request ID"),
});

export const rejectRegistrationBodySchema = z.object({
  reason: z.string().optional().nullable(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profession: z.string().refine(
    (val) => {
      const value = UserProfession[val.toUpperCase() as UserProfessionType];
      return value !== undefined;
    },
    {
      message: `Profession must be one of: ${Object.values(UserProfession).join(", ")}`,
    },
  ),
  bio: z.string().optional().nullable(),
  role: z.enum(["collaborator", "admin"]).optional().default("collaborator"),
});

export const userParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email("Invalid email format").optional(),
  profession: z
    .string()
    .refine(
      (val) => {
        const value = UserProfession[val.toUpperCase() as UserProfessionType];
        return value !== undefined;
      },
      {
        message: `Profession must be one of: ${Object.values(UserProfession).join(", ")}`,
      },
    )
    .optional(),
  bio: z.string().optional().nullable(),
  role: z.enum(["collaborator", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
