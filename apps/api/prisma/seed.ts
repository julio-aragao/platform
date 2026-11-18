import { buildSeedRows } from "@aurora/shared";
import { createPrisma } from "../src/db";

// Edge entry point: DATABASE_URL is read here, with the same default as prisma.config.ts.
// Insert-only: existing rows (including ones edited in the database) are never updated or deleted.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://aurora:aurora@localhost:5432/aurora";
const prisma = createPrisma(databaseUrl);

try {
  const { count } = await prisma.i18nMessage.createMany({ data: buildSeedRows(), skipDuplicates: true });
  console.log(`Seeded i18n messages: ${count} inserted`);
} finally {
  await prisma.$disconnect();
}
