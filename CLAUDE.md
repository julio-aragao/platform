# Aurora Platform

Aurora Platform is an all-TypeScript monorepo (pnpm + Turborepo): Hono API, React/NextJs web, Expo mobile, shared Zod schemas and client, PostgreSQL with Prisma. The app design guidelines are in DESIGN.md.

## Development principles

All development follows **SOLID** and **DRY**. Apply them to new code and when touching existing code.

### SOLID

- **Single responsibility:** one reason to change per module. Keep route handlers thin (parse, call, respond). Put business logic in its own function or module, and data access, LLM calls and job handlers in theirs.
- **Open/closed:** extend by adding, not by editing working code. Add a new route, job, model entry or provider as a new unit. Do not grow `if/else` chains in existing ones.
- **Liskov substitution:** anything injected must be swappable without callers noticing. Real and fake implementations of `GenerateFn`, the Prisma client or the auth client must honour the same contract.
- **Interface segregation:** depend on the smallest interface you need. Pass a function or a narrow type, not a whole client or config object.
- **Dependency inversion:** depend on abstractions injected from the edge. `createApp(deps)` is the pattern: `env`, `prisma`, `auth` and `generate` come in as dependencies. Do not import singletons or read `process.env` inside business logic, and keep new code testable without the network.

### DRY

- **Each data shape is defined once** as a Zod schema in `packages/shared`. It is reused for API validation, OpenAPI, web forms, the mobile client and the typed client. Never redefine or hand-copy a type.
- Web and mobile mirror each other (notes, login, ask-the-model). When logic is the same, move it to `packages/shared`. Don't duplicate it per app.
- Reuse the test helpers in `apps/api/test/helpers.ts` instead of writing new setup.
- Configuration lives in one place: `env.ts` for the API, the `pricing.ts` table for LLM prices, `.env.example` for the variable list.
- Don't abstract on the first repetition. Extract once something is repeated a third time or must stay in sync, and never extract things that merely look alike but change for different reasons.

## Project rules

- Every error response uses the shared `{error: {code, message}}` shape. Better Auth's own `/api/auth/*` routes are the one exception.
- LLM keys and calls stay on the server. Every LLM call is logged to the `LlmCall` table.
- Schema changes go through a Prisma migration. Never edit the database by hand. pg-boss owns its own `pgboss` schema.
- Pin dependency versions exactly. Do not add `minimumReleaseAgeExclude` entries to `pnpm-workspace.yaml`.
- Use Node 22 (`.nvmrc`). The Expo dev server does not run on older versions.
- User-visible text lives only in catalogs (`apps/web/src/i18n/messages`, `packages/shared/src/i18n/catalogs`).
- Page links and redirects go through `@/i18n/navigation`.
- Adding a locale means adding its catalogs and a route-map entry, and registering it in the shared locale module (`LOCALES` and the helpers beside it).
- Code, identifiers, internal route names and comments are English.
- Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before calling work done.
