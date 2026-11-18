# i18n messages in the database: design

Date: 2026-11-18. Status: draft for approval.

## Intent

Today every user-visible string lives in files committed with the code: nested JSON for the web app (`apps/web/src/i18n/messages/{en,pt-br}.json`, 54 keys per locale) and flat TypeScript for validation, API and auth errors (`packages/shared/src/i18n/catalogs/{en,pt-br}.ts`, 13 keys). Changing a word means a code change and a deploy.

The product owner wants the text to be **data**, so that it can be edited without touching code. At some point there will be an edit page for it. For now the text is managed directly in the database table. This design covers the move to the database and the plumbing that makes the later edit page possible. It does not include the edit page.

## Goals

- A Prisma model `I18nMessage`, mapped to the table `i18n_message`, with fields `id` (String, primary key), `name` (String), `message` (String), `locale` (String), created by a Prisma migration.
- A seed that loads every current message, in every locale, from both existing catalog systems into the table. It is safe to run repeatedly.
- At runtime, **no message is read from the catalog files**. The web app and the API read them from the table.
- The API exposes one endpoint that returns all messages for a locale in a single response, answered from an in-memory cache so normal requests do not hit the database.
- Web pages and components keep using next-intl (`getTranslations`, `useTranslations`, `NextIntlClientProvider`) and receive their messages from that endpoint.
- The API's own localized text (error responses, validation messages) comes from the same cached messages, using the same keys it uses today.
- Every language is complete in the database. Adding a language is adding rows plus the usual locale registration (see `CLAUDE.md`).

## Non-goals

- No edit page, no admin API for writing messages, no auth rules for editing. Messages are edited in the table directly.
- No automatic cache refresh: no timer, no TTL, no polling, no change notification. Edits made in the table show up after the API process restarts.
- No new languages and no change to any message text.
- No change to routing, localized pathnames, the language cookie, or `Accept-Language` negotiation. Locale names (`LOCALE_NAMES`) and route slugs (`pathnames.ts`) are not part of the message table.
- No per-message versioning, history, or "missing translation" workflow.

## Anti-goals (a failure even if it technically works)

- A silent fallback to the catalog files, or to another language, when the database or API is unreachable or a key is missing. A missing message must be visible (a test, a log, or an obvious error), not quietly wrong.
- Two sources of truth at runtime. The files are seed input only.
- A database query per page view or per API request.
- Components or pages forked, or message keys renamed, as a side effect. The change should be invisible in the UI: the same text appears in the same places.

## Constraints

From `CLAUDE.md`, which applies to this work:

- Schema changes go through a Prisma migration. Do not edit the database by hand. Pin dependency versions exactly. Node 22.
- Dependency inversion: the API cache and message source are injected through `createApp(deps)`, with a narrow interface and a fake for tests. No `process.env` or Prisma singleton inside business logic. API tests keep running without a network or a database.
- Every error response keeps the `{error: {code, message}}` shape. LLM and other server-side rules are unaffected.
- Each data shape is defined once as a Zod schema in `packages/shared` (the response of the new endpoint is one).
- Configuration lives in one place: `env.ts` for the API, `.env.example` for the variable list.
- User-visible text lives only in catalogs. After this change the database is the runtime catalog and the files are the seed source, so `CLAUDE.md` and the README sentences that say where text lives must be updated.
- Definition of done: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass.

## What exists today (relevant facts)

- Web: `apps/web/src/i18n/request.ts` imports `./messages/${locale}.json`. `src/i18n/types.d.ts` derives the next-intl `Messages` type from `en.json`. Namespaces: `metadata`, `common`, `notFound`, `home`, `infoSheet`, `auth`, `dashboard`, `form`.
- Shared: `translate`, `localizeMessage`, `isMessageKey`, `catalogs`, and the `MessageKey` type are synchronous and used by the API (`errors.ts`, `validation.ts`) and by web forms (`sign-in-form.tsx`, `sign-up-form.tsx`, `lib/form-errors.ts`) through `localizeMessage(locale, key)`. Zod schemas in shared carry message **keys** as issue messages. The `{min}` placeholder is filled with `PASSWORD_MIN_LENGTH`.
- The 13 shared keys (`validation.*`, `error.*`, `auth.*`) and the 54 web keys do not collide, and no key is a prefix of another, so one flat `name` space works. The web `auth` namespace and the shared `auth.*` keys share a prefix but have different leaf names.
- Pages are prerendered today (`generateStaticParams`, `setRequestLocale`). The web app calls the API server-side with `API_URL` (`lib/session.ts`) and proxies `/api/*` to it for the browser.
- Tests that read the files: `apps/web/test/messages-parity.test.ts`, `i18n-guard.test.ts`, `apps/api/test/i18n.test.ts`, `packages/shared/test/messages.test.ts`.

## Approaches

The open decision was how the web app gets the messages from the API.

**A. Render on demand, one API call per page request.** `request.ts` calls the endpoint server-to-server; pages stop being prerendered. Smallest change, components keep using next-intl, edits go live as soon as the API cache is cleared. Costs one internal call per page view.

**B. Prerender at build time from the API.** Pages stay static, but `pnpm build` needs a running, seeded API and database, and an edit only shows after a rebuild. Works against a future edit page.

**C. Static pages with revalidation.** Pages stay static and rebuild in the background, and an edit page would trigger revalidation. Adds a second cache to keep in sync, which the product owner does not want now. It can be layered on top of A later.

**Chosen: A** (the product owner picked it). Reason: it fits "edit the table, then later an edit page" with the least machinery.

## Decisions

Made by the product owner:

1. The model is `i18n_message` with `id`, `name`, `message`, `locale` (all String; `id` is the primary key).
2. The seed loads every message from both catalog systems into it. Runtime reads come from the table only.
3. The web app gets all messages for a locale from the API in one call; the API caches them to avoid database round trips.
4. Approach A (on-demand rendering).
5. No automatic cache refresh for now. The edit page comes later.

Made by me (the designer), for you to check:

6. `name` is the dotted key already in use: nested web JSON is flattened (`home.pillars.pillar1.title`), shared keys stay as they are (`error.badRequest`). The web side turns the flat map back into the nested shape next-intl needs.
7. `id` is deterministic, `"{locale}:{name}"` (for example `pt-br:error.badRequest`), so the seed can upsert by id and be re-run safely. The table also gets `@@unique([name, locale])` and is mapped with `@@map("i18n_message")`, following the other models' snake-case mapping.
8. The API cache loads all rows with one query on first use, groups them by locale, and keeps them for the life of the process. The store has a `clear()` method so the future edit page can invalidate it. Nothing calls it yet.
9. The catalog files stay in the repo as seed input and as the source of the TypeScript key types. The existing parity and Portuguese-guard tests keep checking them, so they still guard the seed data.
10. No fallback to the files at runtime (see anti-goals). If the API cannot be reached, the page fails visibly instead of rendering in the wrong or empty state.
11. The endpoint is public and read-only: messages are not secret. Only the Next server calls it; the browser gets messages through the next-intl provider. The response is sent with `Cache-Control: no-store`.

Added after the builder check (my calls):

12. **Seed semantics: insert-only.** The seed inserts rows that do not exist yet and never updates or deletes existing ones, so it cannot overwrite text edited in the table. A new key added in code reaches an environment by re-running the seed; a changed text in the files does not. The seed is a setup step (documented in the README), not part of every deploy.
13. **Failure handling.** The API loads lazily on first use. A failed load is never cached; the next request retries. When messages are unavailable the API still answers, using the message key as the text (visible, not blank) and logging the error, so `/api/health` and `/api/auth/*` do not depend on the table. The web app throws, and so fails visibly, if the messages call fails or returns an empty set. A single missing key shows next-intl's default (the key path) and is logged.
14. **One API instance** is assumed. With several, each caches on its own until restarted.
15. **Web side caching.** One messages call per request (next-intl memoizes the request config for the whole render). No cross-request cache on the web side.
16. **`pnpm build` must not need the API or the database.** `global-not-found.tsx` must render on demand too.
17. **Files move.** The web JSON catalogs move to `packages/shared/src/i18n/catalogs/web/` so the API seed can read both file sets without importing from another app. Parity tests move with them.
18. **Tests.** Runtime tests (API errors and validation, form errors, translate) use a fake store or a message map. The parity and Portuguese-guard tests keep reading the files, which are now seed input. The "files are not read at runtime" check is a manual step in the final task.

## What is left to the builder

- The endpoint path and response shape (flat map vs nested), within "one call, all messages, one Zod schema in shared".
- Where the seed script lives and how it is run (for example a Prisma seed command and a `db:seed` script), and how it reaches both file sets without one app importing from another app's folder (moving the web JSON into `packages/shared` is acceptable; update `CLAUDE.md` and the README if so).
- How web forms translate shared keys (`localizeMessage` is synchronous and reads the file catalogs). The browser needs these messages too; the likely route is next-intl's `t` with the same keys and `{min}`, fed by the provider's messages. The API side reads the same store instead of the file catalogs.
- How the `Messages` type for next-intl stays typed once messages are no longer imported.
- How pages leave prerendering on Next 16.4 (removing `generateStaticParams` and `setRequestLocale`, or `dynamic = "force-dynamic"`), including `global-not-found.tsx` and `generateMetadata`.
- What "visible failure" looks like when the messages call fails, and what is logged for a missing key.
- The `MessageStore` interface, the Prisma-backed implementation, the in-memory fake, and the tests.
- Updating `.env.example`, the README (languages, database, "prerendered" sentences) and `CLAUDE.md`.
- The order of work and how to split it into reviewable steps.

## Success looks like

- After `pnpm db:migrate` and the seed, `i18n_message` contains one row per message per locale (67 messages × 2 locales = 134 rows today).
- With the API running, every page renders exactly the text it renders today in both languages, and API error and validation messages are unchanged.
- Changing a row in the table and restarting the API changes the text on the page. Without a restart, no query is made to the table after the first load.
- With the files' `messages` folder temporarily emptied, the app still works. With the API down, pages fail visibly.
- API tests run with a fake store and no database. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass.
