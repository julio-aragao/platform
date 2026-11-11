import { createAuthClient } from "better-auth/react";

// Same-origin: /api/auth/* is proxied to the API by next.config.ts.
export const authClient = createAuthClient();
