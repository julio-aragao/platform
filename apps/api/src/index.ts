import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { createAuth } from "./auth";
import { createPrisma } from "./db";
import { loadEnv } from "./env";
import { createPrismaMessageLoader } from "./messages/prisma-loader";
import { createCachedMessageStore } from "./messages/store";

// The only place that touches process.env and builds real dependencies.
const env = loadEnv(process.env);
const prisma = createPrisma(env.DATABASE_URL);
const app = createApp({
  auth: createAuth(env, prisma),
  messages: createCachedMessageStore(createPrismaMessageLoader(prisma)),
});

serve({ fetch: app.fetch, port: env.API_PORT }, ({ port }) => {
  console.log(`API listening on http://localhost:${port}`);
});
