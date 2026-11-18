import { describe, expect, it, vi } from "vitest";
import { createCachedMessageStore, type MessageRecord } from "../src/messages/store";

const rows: MessageRecord[] = [
  { name: "a", message: "A en", locale: "en" },
  { name: "a", message: "A pt", locale: "pt-br" },
  { name: "b", message: "B en", locale: "en" },
  { name: "c", message: "C fr", locale: "fr" },
];

describe("createCachedMessageStore", () => {
  it("loads once for sequential calls", async () => {
    const load = vi.fn(async () => rows);
    const store = createCachedMessageStore(load);
    await store.forLocale("en");
    await store.forLocale("pt-br");
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("loads once for concurrent calls", async () => {
    const load = vi.fn(async () => rows);
    const store = createCachedMessageStore(load);
    await Promise.all([store.forLocale("en"), store.forLocale("en"), store.forLocale("pt-br")]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("groups rows per locale and ignores unknown locales", async () => {
    const store = createCachedMessageStore(async () => rows);
    expect(await store.forLocale("en")).toEqual({ a: "A en", b: "B en" });
    expect(await store.forLocale("pt-br")).toEqual({ a: "A pt" });
  });

  it("does not cache a failed load", async () => {
    const load = vi.fn<() => Promise<MessageRecord[]>>().mockRejectedValueOnce(new Error("down")).mockResolvedValue(rows);
    const store = createCachedMessageStore(load);
    await expect(store.forLocale("en")).rejects.toThrow("down");
    expect(await store.forLocale("en")).toEqual({ a: "A en", b: "B en" });
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("reloads after clear()", async () => {
    const load = vi.fn(async () => rows);
    const store = createCachedMessageStore(load);
    await store.forLocale("en");
    store.clear();
    await store.forLocale("en");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("gives an empty map when the loader returns no rows", async () => {
    const store = createCachedMessageStore(async () => []);
    expect(await store.forLocale("en")).toEqual({});
  });

  it("does not cache an empty load, so rows that appear later are picked up", async () => {
    const load = vi.fn<() => Promise<MessageRecord[]>>().mockResolvedValueOnce([]).mockResolvedValue(rows);
    const store = createCachedMessageStore(load);
    expect(await store.forLocale("en")).toEqual({});
    expect(await store.forLocale("en")).toEqual({ a: "A en", b: "B en" });
    expect(load).toHaveBeenCalledTimes(2);
    await store.forLocale("pt-br");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("shares one in-flight empty load between concurrent calls", async () => {
    const load = vi.fn(async () => [] as MessageRecord[]);
    const store = createCachedMessageStore(load);
    const results = await Promise.all([store.forLocale("en"), store.forLocale("pt-br")]);
    expect(results).toEqual([{}, {}]);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
