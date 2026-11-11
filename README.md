# Aurora Platform

Aurora Platform is a platform to get clients for Aurora Tecnologias

It is an all-TypeScript monorepo (pnpm + Turborepo):

| Path | What it is |
|---|---|
| `apps/web` | Web app: Next.js 16, React 19, Tailwind 4, `next-intl` |
| `apps/api` | API: Hono, Better Auth, Prisma, PostgreSQL |
| `packages/shared` | Shared Zod schemas, locale rules and message catalogs used by both apps |
| `DESIGN.md` | Design system (colours, type, layout) |
| `CLAUDE.md` | Development principles and project rules |
| `docs/superpowers/` | Design documents and implementation plans |

## Requirements

- **Node 22** (see `.nvmrc`).
- **pnpm 12.16.1** (pinned in `package.json`; `corepack enable` picks it up).
- **Docker**, for the local PostgreSQL database.

## Run it locally

```bash
nvm use                       # Node 22
pnpm install
cp .env.example .env          # skip if you already have a .env
pnpm db:up                    # starts PostgreSQL 17 in Docker on port 5432
pnpm db:migrate               # applies the Prisma migrations
pnpm dev                      # runs the API and the web app together
```

Then open:

- Web app: <http://localhost:3000> (redirects to `/pt-br` or `/en`, see [Languages](#languages))
- API health check: <http://localhost:4000/api/health>

The web app proxies `/api/*` to the API, so the browser only talks to one origin and no CORS setup is needed.

### Environment variables

All variables are listed in `.env.example`. `.env` is git-ignored.

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | api | PostgreSQL connection string (matches `docker-compose.yml`) |
| `API_PORT` | api | Port the API listens on (default `4000`) |
| `WEB_ORIGIN` | api, web | Origin the browser uses (`http://localhost:3000`). The web app reads it at build time for canonical and `hreflang` links |
| `BETTER_AUTH_URL` | api | Public URL of the auth endpoints |
| `BETTER_AUTH_SECRET` | api | Auth secret, 32 characters or more. Generate one with `openssl rand -base64 32` |
| `API_URL` | web | Where the web app proxies `/api` to (`http://localhost:4000`) |

## Test it

```bash
pnpm test                          # every package
pnpm --filter @aurora/shared test  # one package
pnpm --filter @aurora/api test
pnpm --filter @aurora/web test
```

Tests run with Vitest and need no database or network: the API tests inject a fake auth client through `createApp(deps)`, and the web tests exercise the proxy, routing and helpers directly.

Before calling any work done, run the full gate:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

`pnpm test` also runs two repository guards: the catalog parity test (every language has the same keys) and the Portuguese guard (no Portuguese outside the translation files).

## Build and run for production

```bash
pnpm build
pnpm --filter @aurora/api start    # node dist/index.js
pnpm --filter @aurora/web start    # next start, port 3000
```

Set `WEB_ORIGIN` to the real public origin before building the web app. Pages are prerendered, so the value is baked in at build time.

## Languages

The app is available in **Brazilian Portuguese (`pt-br`, the default)** and **English (`en`)**. The code, identifiers and internal route names are English; Portuguese lives only in translation data.

<!-- i18n-guard:ignore-start -->
- **URLs carry the language and are translated too.** For example `/en/sign-in` and `/pt-br/entrar` are the same page. Route names and slugs live in `apps/web/src/i18n/pathnames.ts`.
<!-- i18n-guard:ignore-end -->
- **Which language you get**, in order: the language in the URL, then the `NEXT_LOCALE` cookie (set when you use the language switcher), then the browser's `Accept-Language`, then `pt-br`.
<!-- i18n-guard:ignore-start -->
- **Old unprefixed URLs** (`/`, `/entrar`, `/criar-conta`, `/painel`) redirect to the right localised URL, keeping the query string.
<!-- i18n-guard:ignore-end -->
- **API messages** follow the `Accept-Language` header of the request. The web app sends the language of the page you are on.

Where text lives:

| What | Where |
|---|---|
| Page and component copy | `apps/web/src/i18n/messages/{en,pt-br}.json` |
| Validation, API and auth error messages | `packages/shared/src/i18n/catalogs/` |
| Locale list, negotiation | `packages/shared/src/i18n/locales.ts` |

Rules to keep:

- Never hard-code user-visible text. Add a key to **both** catalogs; the parity test fails if they differ.
- Build links and redirects with `Link`/`redirect`/`useRouter` from `@/i18n/navigation`, never from `next/link` or `next/navigation` (ESLint enforces this).
- To add a language: add its catalogs, add its slugs to `pathnames.ts`, and register it in the shared locale module (`LOCALES` and the helpers beside it).

## Database

PostgreSQL runs in Docker (`docker-compose.yml`, user, password and database all `aurora`).

```bash
pnpm db:up        # start the database
pnpm db:migrate   # create and apply a migration in development (prisma migrate dev)
pnpm db:deploy    # apply existing migrations (prisma migrate deploy), for CI and production
docker compose stop db   # stop it; the data stays in the pgdata volume
```

Schema changes always go through a Prisma migration (`apps/api/prisma/schema.prisma`). Never edit the database by hand.

## Troubleshooting

- **`pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`:** a new dependency has an install script pnpm has not been told about. Decide whether it needs to run and add it to `allowBuilds` in `pnpm-workspace.yaml` as `true` or `false`.
- **The API cannot reach the database:** check `pnpm db:up` is running and `DATABASE_URL` in `.env` matches `docker-compose.yml`.
- **Web or API tests fail with errors about `@aurora/shared`:** the other packages use its built output. Run `pnpm --filter @aurora/shared build`, or run the tests through the root `pnpm test`, which builds it first.
- **Port 3000 or 4000 is busy:** stop the other process, or change `API_PORT` and `API_URL`.

## Project rules

The short version; the full list is in `CLAUDE.md`.

- Follow SOLID and DRY. Each data shape is defined once, as a Zod schema in `packages/shared`.
- Every API error uses the `{error: {code, message}}` shape (Better Auth's `/api/auth/*` routes are the one exception).
- LLM keys and calls stay on the server, and every LLM call is logged to the `LlmCall` table (no LLM feature exists yet).
- Pin dependency versions exactly. Do not add `minimumReleaseAgeExclude` entries to `pnpm-workspace.yaml`.
