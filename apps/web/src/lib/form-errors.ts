type Issue = { path: ReadonlyArray<PropertyKey>; message: string };

/** Turns validation issues (whose messages are catalog keys) into per-field text. */
export function fieldErrorsFromIssues(
  localize: (message: string) => string,
  issues: ReadonlyArray<Issue>,
): Record<string, string> {
  return Object.fromEntries(issues.map((issue) => [String(issue.path[0]), localize(issue.message)]));
}
