import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiComparisonTable } from "./sdui-comparison-table";

describe("SduiComparisonTable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with columns and rows", () => {
    // Setup
    const component = {
      id: "ct1",
      type: "comparison_table" as const,
      props: {
        columns: ["Free", "Pro", "Enterprise"],
        rows: [
          ["1 user", "5 users", "Unlimited"],
          ["1GB", "10GB", "100GB"],
        ],
        highlightedColumn: 1,
      },
    };

    // Act
    const result = SduiComparisonTable({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty table", () => {
    // Setup
    const component = {
      id: "ct1",
      type: "comparison_table" as const,
      props: { columns: [], rows: [] },
    };

    // Act
    const result = SduiComparisonTable({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
