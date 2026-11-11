import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
});

export type Env = z.infer<typeof envSchema>;

/** Pure: takes the raw variables, so tests and the entrypoint decide where they come from. */
export function loadEnv(source: Record<string, string | undefined>): Env {
  return envSchema.parse(source);
}
