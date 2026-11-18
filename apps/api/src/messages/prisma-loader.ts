import type { PrismaClient } from "../generated/prisma/client";
import type { MessageRecord } from "./store";

export function createPrismaMessageLoader(prisma: PrismaClient): () => Promise<MessageRecord[]> {
  return () => prisma.i18nMessage.findMany({ select: { name: true, message: true, locale: true } });
}
