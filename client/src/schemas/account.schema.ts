import { Role } from "@/enums/user-role.enum";
import z from "zod";

export const CreateAccountSchema = z
  .object({
    email: z
      .string("email is required")
      .min(1, "email is required")
      .email("Invalid email format"),
    password: z.string("Password cannot be empty").min(1, {
      message: "Password cannot be empty",
    }),
    fullName: z.string("Full name is required").min(1, "Full name is required"),
    avatar: z.string().optional(),
    role: z.enum(Role, "Role is required"),
    isActive: z.boolean("Is active cannot be empty"),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password;

    if (pwd.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must be at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one uppercase letter",
      });
    }

    if (!/[0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one number",
      });
    }

    if (!/[^A-Za-z0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one special character",
      });
    }
  });
export type CreateAccountInput = z.TypeOf<typeof CreateAccountSchema>;
