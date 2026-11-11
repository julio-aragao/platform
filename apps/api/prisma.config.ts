import { defineConfig } from "prisma/config";

// DATABASE_URL is read here (the CLI edge), not inside business logic.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://aurora:aurora@localhost:5432/aurora" },
});
