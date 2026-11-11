import type { MessageKey } from "./en";

export const ptBr: Record<MessageKey, string> = {
  "validation.email.invalid": "Informe um e-mail válido.",
  "validation.password.required": "Informe a senha.",
  "validation.name.required": "Informe seu nome.",
  "validation.password.tooShort": "A senha precisa ter ao menos {min} caracteres.",
  "error.badRequest": "A requisição é inválida.",
  "error.unauthorized": "Entre na sua conta para continuar.",
  "error.forbidden": "Você não tem acesso a isso.",
  "error.notFound": "Rota não encontrada.",
  "error.internal": "Algo deu errado. Tente novamente.",
  "auth.invalidCredentials": "E-mail ou senha incorretos. Confira os dados e tente de novo.",
  "auth.userExists": "Já existe uma conta com este e-mail. Entre ou use outro e-mail.",
  "auth.passwordTooShort": "A senha é curta demais. Use ao menos {min} caracteres.",
  "auth.fallback": "Não foi possível concluir. Verifique sua conexão e tente novamente.",
};
