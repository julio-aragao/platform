import { describe, expect, it } from "vitest";
import { flattenMessages, unflattenMessages, webCatalogs } from "../src/i18n";

describe("flattenMessages", () => {
  it("joins nested names with dots", () => {
    expect(flattenMessages({ a: { b: "x" }, c: "y" })).toEqual({ "a.b": "x", c: "y" });
  });
});

describe("unflattenMessages", () => {
  it("round-trips the web catalog", () => {
    expect(unflattenMessages(flattenMessages(webCatalogs.en))).toEqual(webCatalogs.en);
  });

  it("throws when a name is both a leaf and a prefix", () => {
    expect(() => unflattenMessages({ home: "x", "home.heroTitle": "y" })).toThrow();
    expect(() => unflattenMessages({ "home.heroTitle": "y", home: "x" })).toThrow();
  });
});

describe("unflattenMessages on names from the database", () => {
  it("names the full conflicting prefix path", () => {
    expect(() => unflattenMessages({ "a.b": "x", "a.b.c": "y" })).toThrow(/"a\.b"/);
    expect(() => unflattenMessages({ "a.b.c": "y", "a.b": "x" })).toThrow(/"a\.b"/);
  });

  it.each(["", "a..b", ".a", "a."])("throws on an empty name segment in %j", (name) => {
    expect(() => unflattenMessages({ [name]: "x" })).toThrow(/empty/);
  });

  it.each(["__proto__", "a.__proto__", "constructor.a", "a.prototype.b"])(
    "throws on the reserved segment in %j",
    (name) => {
      expect(() => unflattenMessages({ [name]: "x" })).toThrow(/reserved/);
    },
  );
});
