const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha incorretos. Confira os dados e tente de novo.",
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail. Entre ou use outro e-mail.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail. Entre ou use outro e-mail.",
  PASSWORD_TOO_SHORT: "A senha é curta demais. Use ao menos 8 caracteres.",
};

export const FALLBACK_MESSAGE = "Não foi possível concluir. Verifique sua conexão e tente novamente.";

export function authErrorMessage(error: { code?: string } | null | undefined): string {
  return (error?.code && MESSAGES[error.code]) || FALLBACK_MESSAGE;
}
