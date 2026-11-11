import { describe, expect, it } from "vitest";
import { formatMonthYear, formatNumber, formatShortDate } from "../src/i18n/format";

const d = new Date(Date.UTC(2026, 10, 5));

describe("format", () => {
  it("formats numbers per locale", () => {
    expect(formatNumber("pt-br", 1250)).toBe("1.250");
    expect(formatNumber("en", 1250)).toBe("1,250");
  });

  it("formats short dates per locale", () => {
    expect(formatShortDate("pt-br", d)).toBe("05/11/2026");
    expect(formatShortDate("en", d)).toBe("11/05/2026");
  });

  it("formats month and year", () => {
    expect(formatMonthYear("pt-br", d)).toBe("11/2026");
    expect(formatMonthYear("en", d)).toBe("11/2026");
  });
});
