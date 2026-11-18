/** Base URL of the API, read from the environment passed in (`API_URL`), with the local default. */
export function apiUrl(env: Record<string, string | undefined>): string {
  return env.API_URL ?? "http://localhost:4000";
}
