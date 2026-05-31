import { UserProfession, UserProfessionType } from "@/types/entities";
import { z } from "zod";

export const userRegisterRequest = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profession: z.string().refine(
    (val) => {
      const value = UserProfession[val as UserProfessionType];
      return value !== undefined;
    },
    {
      message:
        "Profession must be one of: student, teacher, developer, designer",
    },
  ),
  bio: z.string().optional().nullable(),
});
