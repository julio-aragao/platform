import { Hono } from "hono";
import type { MeResponse } from "@aurora/shared";
import type { AuthPort } from "../auth";
import { ApiError } from "../errors";

export function meRoutes(auth: Pick<AuthPort, "getUser">) {
  return new Hono().get("/me", async (c) => {
    const user = await auth.getUser(c.req.raw.headers);
    if (!user) throw new ApiError("unauthorized");
    return c.json<MeResponse>({ user });
  });
}
