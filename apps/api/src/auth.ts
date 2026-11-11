import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PASSWORD_MIN_LENGTH, type SessionUser } from "@aurora/shared";
import type { PrismaClient } from "./generated/prisma/client";
import type { Env } from "./env";

/** The narrow surface the app needs from an auth provider. Real and fake must honour it. */
export interface AuthPort {
  handler(request: Request): Promise<Response>;
  getUser(headers: Headers): Promise<SessionUser | null>;
}

type AuthEnv = Pick<Env, "BETTER_AUTH_SECRET" | "BETTER_AUTH_URL" | "WEB_ORIGIN">;

export function createAuth(env: AuthEnv, prisma: PrismaClient): AuthPort {
  const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.WEB_ORIGIN],
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true, minPasswordLength: PASSWORD_MIN_LENGTH },
  });

  return {
    handler: (request) => auth.handler(request),
    async getUser(headers) {
      const session = await auth.api.getSession({ headers });
      if (!session) return null;
      const { id, name, email } = session.user;
      return { id, name, email };
    },
  };
}
