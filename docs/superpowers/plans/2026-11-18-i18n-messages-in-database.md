# i18n messages in the database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every UI and API message from catalog files into a Postgres table `i18n_message`, served by one cached API call, with the files kept only as seed input.

**Architecture:** `packages/shared` owns the message data shapes, the flatten/unflatten helpers and the seed rows. The API holds an injected, process-lifetime `MessageStore` (lazy load, no TTL, `clear()` for a future edit page), exposes `GET /api/messages?locale=`, and localizes its own errors from the same store. The web app's next-intl request config fetches that endpoint on every request, so `[locale]` pages render on demand.

**Tech Stack:** Prisma 7 (`prisma-client` generator, PrismaPg), Hono 4 + zod validator, Next 16.4 + next-intl 4, Vitest, pnpm + Turborepo.

**Spec:** `docs/superpowers/specs/2026-11-18-i18n-messages-in-database-design.md`

## Global Constraints

- Table `i18n_message` via model `I18nMessage`: `id String @id`, `name String`, `message String`, `locale String`, `@@unique([name, locale])`, `@@map("i18n_message")`. Created by a Prisma migration, never by hand.
- `id` is `"{locale}:{name}"`. `name` is the dotted key (`home.heroTitle`, `error.badRequest`). Today: 54 web + 13 shared keys, 2 locales, 134 rows.
- The seed is insert-only (`createMany` with `skipDuplicates`): it never updates or deletes rows.
- No message is read from the catalog files at runtime. No TTL, timer or polling on the cache. No web-side cross-request cache.
- No fallback to files or to another language. Failures are visible: web throws, API answers with the message key as text and logs.
- API messages stay in the `{error: {code, message}}` shape. Dependencies are injected through `createApp(deps)`; no `process.env` or Prisma singleton inside business logic; API tests need no network or database.
- Each data shape is one Zod schema in `packages/shared`. Pin dependency versions exactly (no new dependencies are expected). Node 22.
- `pnpm build` must work without the API or database running.
- Before calling the work done: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Review Focus

- Seed not run (table empty): web fails with an error naming `pnpm db:seed`; API still answers with keys as text. Tests: Task 3 (store with no rows), Task 4 (`fetchMessages` on empty map).
- First load fails, then the database recovers: the failure is not cached. Test: Task 3 store.
- Seed re-run after someone edited a row: the edit survives. Manual check: Task 2.
- A row name that is both a leaf and a prefix of another (`home` next to `home.heroTitle`): fails loudly instead of dropping text. Test: Task 1 `unflattenMessages`.
- `locale` missing or unsupported on `/api/messages`: 400 in the shared error shape. Test: Task 3.

---

### Task 1: Shared: relocate web catalogs, flatten helpers, seed rows, endpoint schemas

Additive only: nothing outside `packages/shared` changes behaviour, and web keeps working on the moved files.

**Files:**
- Move: `apps/web/src/i18n/messages/{en,pt-br}.json` → `packages/shared/src/i18n/catalogs/web/{en,pt-br}.json` (`git mv`)
- Create: `packages/shared/src/i18n/catalogs/web/index.ts`, `packages/shared/src/i18n/flatten.ts`, `packages/shared/src/i18n/seed.ts`, `packages/shared/src/messages-api.ts`
- Modify: `packages/shared/src/i18n/index.ts`, `packages/shared/src/index.ts` (export the new modules), `apps/web/src/i18n/request.ts`, `apps/web/src/i18n/types.d.ts`, `apps/web/test/i18n-guard.test.ts` (drop the `apps/web/src/i18n/messages` entry from `SKIPPED_PATHS`; the walker already skips any `catalogs` directory)
- Move + modify: `apps/web/test/messages-parity.test.ts` → `packages/shared/test/web-catalogs.test.ts` (import `webCatalogs` instead of the JSON paths)
- Test: `packages/shared/test/flatten.test.ts`, `packages/shared/test/seed.test.ts`, `packages/shared/test/messages-api.test.ts`

**Interfaces:**
- Produces:
  - `type MessageTree = { [key: string]: string | MessageTree }`
  - `flattenMessages(tree: MessageTree): Record<string, string>` (dot-joined names)
  - `unflattenMessages(flat: Readonly<Record<string, string>>): MessageTree`; throws `Error` when a name is both a leaf and a prefix of another name
  - `type WebMessages = typeof en` (the `en.json` shape) and `webCatalogs: Record<Locale, WebMessages>`
  - `interface MessageRow { id: string; name: string; message: string; locale: Locale }` and `buildSeedRows(): MessageRow[]` (web catalogs flattened plus the shared `catalogs`; `id` is `"${locale}:${name}"`; throws if a name appears in both sources for one locale)
  - `messagesQuerySchema = z.object({ locale: z.enum(LOCALES) })`, `messagesResponseSchema = z.object({ locale: z.enum(LOCALES), messages: z.record(z.string(), z.string()) })`, with inferred types `MessagesQuery` and `MessagesResponse`

- [ ] **Step 1: Write the failing tests**
  - `flatten.test.ts`: `flattenMessages({a:{b:"x"},c:"y"})` equals `{"a.b":"x", c:"y"}`; `unflattenMessages(flattenMessages(webCatalogs.en))` deep-equals `webCatalogs.en`; `unflattenMessages({home:"x","home.heroTitle":"y"})` throws; the same with the keys in the opposite order throws too.
  - `seed.test.ts`: `buildSeedRows()` has length 134; ids are unique and every id equals `${locale}:${name}`; `(name, locale)` pairs are unique; for each locale, `unflattenMessages` of its rows' `{name: message}` map deep-equals the `webCatalogs[locale]` tree merged with the shared `catalogs[locale]` keys (placeholders such as `{min}` and `{company}` survive byte for byte).
  - `messages-api.test.ts`: the query schema accepts `{locale:"en"}` and rejects `{locale:"fr"}` and `{}`; the response schema accepts `{locale:"en", messages:{"a.b":"x"}}`.
- [ ] **Step 2: Run** `pnpm --filter @aurora/shared test`. Expected: FAIL (modules do not exist).
- [ ] **Step 3: Move the JSON files and the parity test** with `git mv`, then update the parity test's imports to `webCatalogs`. Update `request.ts` to `messages: webCatalogs[locale]` and `types.d.ts` to `Messages: WebMessages` (interim wiring; Task 4 replaces `request.ts`).
- [ ] **Step 4: Implement** `flatten.ts`, `catalogs/web/index.ts`, `seed.ts`, `messages-api.ts` to the signatures above and export them from the shared index files.
- [ ] **Step 5: Run** `pnpm --filter @aurora/shared test && pnpm --filter @aurora/web test && pnpm typecheck`. Expected: all PASS (the Portuguese guard still passes: the new JSON lives under a `catalogs` directory).
- [ ] **Step 6: Commit** `refactor(shared): move web catalogs to shared, add flatten helpers and seed rows`

---

### Task 2: Prisma model, migration and seed

**Files:**
- Modify: `apps/api/prisma/schema.prisma`, `apps/api/prisma.config.ts` (add `migrations: { seed: "tsx prisma/seed.ts" }`), `apps/api/package.json` (script `"db:seed": "prisma db seed"`), `package.json` (script `"db:seed": "pnpm --filter @aurora/shared build && pnpm --filter @aurora/api db:seed"`), `apps/api/tsconfig.json` (add `prisma/seed.ts` to `include`), `README.md` (Database section: run `pnpm db:seed` after `pnpm db:migrate`; seed is insert-only and a setup step; new keys reach an environment by re-running it)
- Create: `apps/api/prisma/migrations/<timestamp>_add_i18n_message/migration.sql` (generated), `apps/api/prisma/seed.ts`

**Interfaces:**
- Consumes: `buildSeedRows(): MessageRow[]` (Task 1), `createPrisma(databaseUrl: string): PrismaClient` (`src/db.ts`).
- Produces: Prisma accessor `prisma.i18nMessage` with fields `id`, `name`, `message`, `locale`.

- [ ] **Step 1: Add the model** to `schema.prisma` exactly as in Global Constraints.
- [ ] **Step 2: Generate the migration.** Run `pnpm db:up`, then `pnpm --filter @aurora/api exec prisma migrate dev --name add_i18n_message`. Expected: a new migration folder; the SQL creates `i18n_message` with a primary key on `id` and a unique index on `(name, locale)`.
- [ ] **Step 3: Write `seed.ts`.** It reads `process.env.DATABASE_URL` (same default as `prisma.config.ts`; this file is an edge entry point), builds the client with `createPrisma`, calls `prisma.i18nMessage.createMany({ data: buildSeedRows(), skipDuplicates: true })`, prints how many rows were inserted, and disconnects in a `finally`.
- [ ] **Step 4: Verify the seed.** Run `pnpm db:seed`. Expected: `134` inserted. Run it again. Expected: `0` inserted.
- [ ] **Step 5: Verify edits survive.** In the database container run `UPDATE i18n_message SET message = 'EDITED' WHERE id = 'en:home.heroTitle';`, run `pnpm db:seed` again, then `SELECT message FROM i18n_message WHERE id = 'en:home.heroTitle';`. Expected: `EDITED`. Restore the row with the original text from `webCatalogs.en` afterwards.
- [ ] **Step 6: Run** `pnpm --filter @aurora/api typecheck && pnpm lint`. Expected: PASS.
- [ ] **Step 7: Commit** `feat(api): add i18n_message model, migration and insert-only seed`

---

### Task 3: API: message store, endpoint, localized errors from the store

Also changes the shared lookup functions to take a message map. Web forms get a temporary file-based adapter that Task 4 removes.

**Files:**
- Create: `apps/api/src/messages/store.ts`, `apps/api/src/messages/prisma-loader.ts`, `apps/api/src/routes/messages.ts`
- Modify: `packages/shared/src/i18n/messages.ts`, `apps/api/src/locale.ts`, `apps/api/src/errors.ts`, `apps/api/src/app.ts`, `apps/api/src/index.ts`, `apps/api/test/helpers.ts`, `apps/api/test/i18n.test.ts`, `packages/shared/test/messages.test.ts`, `apps/web/src/lib/form-errors.ts`, `apps/web/src/components/sign-in-form.tsx`, `apps/web/src/components/sign-up-form.tsx`, `apps/web/test/form-errors.test.ts`
- Test: `apps/api/test/store.test.ts`, `apps/api/test/messages-route.test.ts`

**Interfaces:**
- Consumes: `buildSeedRows`, `MessageRow`, `messagesQuerySchema`, `messagesResponseSchema` (Task 1).
- Produces:
  - shared: `type MessageMap = Readonly<Record<string, string>>`; `translate(messages: MessageMap, key: MessageKey, params?: Record<string, string | number>): string` (a missing key returns the key itself); `localizeMessage(messages: MessageMap, message: string, fallbackKey?: MessageKey): string`. `catalogs`, `isMessageKey` and `MessageKey` stay.
  - API: `interface MessageStore { forLocale(locale: Locale): Promise<MessageMap> }`; `interface ClearableMessageStore extends MessageStore { clear(): void }`; `interface MessageRecord { name: string; message: string; locale: string }`; `createCachedMessageStore(load: () => Promise<ReadonlyArray<MessageRecord>>): ClearableMessageStore`; `createPrismaMessageLoader(prisma: PrismaClient): () => Promise<MessageRecord[]>`; `messageRoutes(store: MessageStore)`; `localeMiddleware(store: MessageStore)` sets context variables `locale` and `messages: MessageMap`; `requestMessages(c: Context): MessageMap` (`{}` when unset); `AppDeps` gains `messages: MessageStore`.
  - test helper: `fakeMessageStore(): MessageStore` = `createCachedMessageStore(async () => buildSeedRows())`; `buildTestApp(auth = fakeAuth(), messages = fakeMessageStore())`.

- [ ] **Step 1: Write the failing tests**
  - `store.test.ts` (loader is a `vi.fn`): two `forLocale` calls load once; `Promise.all` of calls loads once; rows are grouped per locale and rows with an unknown locale are ignored; a loader that rejects once then resolves: first call rejects, second call succeeds and the loader ran twice; `clear()` makes the next call reload; a loader returning no rows gives `{}`.
  - `messages-route.test.ts`: `GET /api/messages?locale=en` is 200 with header `cache-control: no-store`, parses with `messagesResponseSchema`, and `messages["error.unauthorized"]` is `"Sign in to your account to continue."` and `messages["home.heroTitle"]` is `webCatalogs.en.home.heroTitle`; `?locale=fr` and no `locale` are 400 with `error.code` `bad_request`.
  - `i18n.test.ts` additions: with a store whose loader always rejects, `/api/me` answers 401 and `error.message` equals `"error.unauthorized"` (the key), `/api/health` answers 200, and `console.error` was called (spy). With a store that returns no rows, the same 401 message is the key.
  - `messages.test.ts` (shared): update calls to pass `catalogs.en` / `catalogs["pt-br"]`; add `translate({}, "error.badRequest")` returns `"error.badRequest"`.
  - `form-errors.test.ts`: call `fieldErrorsFromIssues(catalogs[locale], issues)` (temporary signature, see Step 3).
- [ ] **Step 2: Run** `pnpm --filter @aurora/api test && pnpm --filter @aurora/shared test`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Shared `messages.ts` to the signatures above.
  - `store.ts`: memoize the load promise; on rejection clear the memo so the next call retries; group by locale on success.
  - `prisma-loader.ts`: `prisma.i18nMessage.findMany({ select: { name: true, message: true, locale: true } })`.
  - `locale.ts`: the middleware negotiates the locale as before, then `await store.forLocale(locale)` inside try/catch; on failure log with `console.error` and set `messages` to `{}`.
  - `errors.ts`: `errorResponse` localizes with `requestMessages(c)`.
  - `routes/messages.ts`: `GET /messages` with `zValidator("query", messagesQuerySchema, zodValidationHook)`, answers `{locale, messages: await store.forLocale(locale)}` with `Cache-Control: no-store`. Register with `app.route("/api", messageRoutes(messages))` in `createApp`.
  - `index.ts`: `createCachedMessageStore(createPrismaMessageLoader(prisma))`.
  - Web (temporary, removed in Task 4): `fieldErrorsFromIssues(messages: MessageMap, issues)` and both forms pass `catalogs[locale]`; keep behaviour identical.
- [ ] **Step 4: Run** `pnpm test && pnpm typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(api): serve messages from a cached store and localize errors from it`

---

### Task 4: Web: read messages from the API, render on demand, drop the temporary adapter

**Files:**
- Create: `apps/web/src/lib/messages.ts`, `apps/web/src/lib/localize-message.ts`
- Modify: `apps/web/src/i18n/request.ts`, `apps/web/src/lib/form-errors.ts`, `apps/web/src/components/sign-in-form.tsx`, `apps/web/src/components/sign-up-form.tsx`, `apps/web/src/app/[locale]/layout.tsx`, `apps/web/src/app/[locale]/page.tsx`, `apps/web/src/app/[locale]/sign-in/page.tsx`, `apps/web/src/app/[locale]/sign-up/page.tsx`, `apps/web/src/app/[locale]/admin-sign-in/page.tsx`, `apps/web/src/app/[locale]/admin-sign-up/page.tsx`, `apps/web/src/app/[locale]/dashboard/page.tsx`, `apps/web/src/app/global-not-found.tsx`, `apps/web/test/form-errors.test.ts`
- Test: `apps/web/test/messages.test.ts`, `apps/web/test/localize-message.test.ts`

**Interfaces:**
- Consumes: `messagesResponseSchema`, `unflattenMessages`, `MessageMap`, `isMessageKey`, `PASSWORD_MIN_LENGTH` (shared).
- Produces:
  - `fetchMessages(locale: Locale, opts?: { apiUrl?: string; fetchImpl?: typeof fetch }): Promise<MessageMap>`; `apiUrl` defaults to `process.env.API_URL ?? "http://localhost:4000"` as in `lib/session.ts`; calls `GET {apiUrl}/api/messages?locale={locale}` with `cache: "no-store"`; throws on a non-2xx status, a body that fails `messagesResponseSchema`, or an empty `messages` map (message names `pnpm db:seed`).
  - `type Translate = (key: string, values?: Record<string, string | number>) => string`; `createLocalizer(t: Translate): (message: string) => string` (a catalog key → `t(key, { min: PASSWORD_MIN_LENGTH })`; any other text → `t("error.badRequest")`); `useLocalizer(): (message: string) => string` (`createLocalizer(useTranslations())`, the one place with a cast).
  - `fieldErrorsFromIssues(localize: (message: string) => string, issues: ReadonlyArray<Issue>): Record<string, string>`.

- [ ] **Step 1: Write the failing tests**
  - `messages.test.ts` (stub `fetchImpl`): requests `http://api.test/api/messages?locale=en` with `cache: "no-store"` and returns the map; rejects on a 500; rejects when `messages` is `{}` with a message containing `db:seed`; rejects on a malformed body; propagates a network error.
  - `localize-message.test.ts`: with `t = (key, values) => ...` recording its calls, `createLocalizer(t)("validation.password.tooShort")` calls `t` with `("validation.password.tooShort", { min: 8 })`; `createLocalizer(t)("Something unexpected")` calls `t("error.badRequest")`.
  - `form-errors.test.ts`: rewrite against a fake localizer (`(m) => `L:${m}``): keys each issue by its first path segment and applies the localizer.
- [ ] **Step 2: Run** `pnpm --filter @aurora/web test`. Expected: FAIL.
- [ ] **Step 3: Implement** the modules above. `request.ts` becomes `messages: unflattenMessages(await fetchMessages(locale))`. Both forms use `const localize = useLocalizer()` for `fieldErrorsFromIssues(localize, ...)` and for `localize(authErrorMessageKey(error.code))`, and drop `useLocale` where it is now unused.
- [ ] **Step 4: Leave static rendering.** Remove `generateStaticParams` and every `setRequestLocale` call (and its import) from the layout and pages above. Add `export const dynamic = "force-dynamic"` to `[locale]/layout.tsx` and to `global-not-found.tsx`.
- [ ] **Step 5: Run** `pnpm lint && pnpm typecheck && pnpm test`. Expected: PASS.
- [ ] **Step 6: Verify the build needs no API.** With the API stopped, run `pnpm --filter @aurora/web build`. Expected: success, and the route table marks the `[locale]` routes as dynamic (`ƒ`), none as static (`●`). If `global-not-found` still prerenders or fetches, fix it before moving on.
- [ ] **Step 7: Commit** `feat(web): read messages from the API and render pages on demand`

---

### Task 5: Docs and end-to-end verification

**Files:**
- Modify: `CLAUDE.md` (the catalogs rule: the `i18n_message` table is the runtime source; the files under `packages/shared/src/i18n/catalogs` are seed input and the place to add new keys), `README.md` ("Pages are prerendered" sentences, Languages "Where text lives" table now pointing at `packages/shared/src/i18n/catalogs/web/` and the table, Run-it-locally steps including `pnpm db:seed`), `.env.example` (replace the "Read at build time: pages are prerendered" comment on `WEB_ORIGIN`; keep it accurate for `siteUrl`)

- [ ] **Step 1: Update the docs** as listed. Mention in the README: single API instance, edits to the table show after an API restart, seed is insert-only.
- [ ] **Step 2: Full gate.** Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Expected: all PASS.
- [ ] **Step 3: End-to-end.** `pnpm db:up && pnpm db:migrate && pnpm db:seed && pnpm dev`. Open `/pt-br`, `/en`, `/en/sign-in` and submit an empty form (field errors in the page language), and a wrong password (auth error). Expected: text identical to before this change.
- [ ] **Step 4: Files are not read at runtime.** Change one row in the table (`UPDATE i18n_message SET message = 'DB TEXT' WHERE id = 'en:home.heroTitle'`), restart the API, reload `/en`. Expected: the hero title shows `DB TEXT`, which no file contains. Restore the row.
- [ ] **Step 5: Failure is visible.** Stop the API and reload `/en`. Expected: an error page, not English or empty text. Restart the API.
- [ ] **Step 6: Commit** `docs: describe database-backed messages`
