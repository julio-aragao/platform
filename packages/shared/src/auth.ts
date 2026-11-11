import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export const signInInputSchema = z.object({
  email: z.email("validation.email.invalid"),
  password: z.string({ error: "validation.password.required" }).min(1, "validation.password.required"),
});
export type SignInInput = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = z.object({
  name: z.string({ error: "validation.name.required" }).trim().min(2, "validation.name.required"),
  email: z.email("validation.email.invalid"),
  password: z
    .string({ error: "validation.password.required" })
    .min(PASSWORD_MIN_LENGTH, "validation.password.tooShort"),
});
export type SignUpInput = z.infer<typeof signUpInputSchema>;

export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

export const meResponseSchema = z.object({ user: sessionUserSchema });
export type MeResponse = z.infer<typeof meResponseSchema>;
