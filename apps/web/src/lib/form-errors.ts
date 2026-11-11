import { localizeMessage, type Locale } from "@aurora/shared";

type Issue = { path: ReadonlyArray<PropertyKey>; message: string };

/** Turns validation issues (whose messages are catalog keys) into per-field text in the page language. */
export function fieldErrorsFromIssues(locale: Locale, issues: ReadonlyArray<Issue>): Record<string, string> {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path[0]), localizeMessage(locale, issue.message)]),
  );
}
