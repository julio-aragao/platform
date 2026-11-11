import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export const signInInputSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});
export type SignInInput = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `A senha precisa ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`),
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
