export const en = {
  "validation.email.invalid": "Enter a valid email address.",
  "validation.password.required": "Enter your password.",
  "validation.name.required": "Enter your name.",
  "validation.password.tooShort": "The password must be at least {min} characters long.",
  "error.badRequest": "The request is invalid.",
  "error.unauthorized": "Sign in to your account to continue.",
  "error.forbidden": "You do not have access to this.",
  "error.notFound": "Route not found.",
  "error.internal": "Something went wrong. Try again.",
  "auth.invalidCredentials": "Incorrect email or password. Check your details and try again.",
  "auth.userExists": "An account with this email already exists. Sign in or use another email.",
  "auth.passwordTooShort": "The password is too short. Use at least {min} characters.",
  "auth.fallback": "We could not complete this. Check your connection and try again.",
} as const;

export type MessageKey = keyof typeof en;
