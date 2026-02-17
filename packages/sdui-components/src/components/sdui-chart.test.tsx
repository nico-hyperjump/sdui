import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiChart } from "./sdui-chart";

describe("SduiChart", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders bar chart with data", () => {
    // Setup
    const component = {
      id: "ch1",
      type: "chart" as const,
      props: {
        type: "bar",
        data: [10, 20, 30],
        labels: ["A", "B", "C"],
      },
    };

    // Act
    const result = SduiChart({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders placeholder for non-bar chart types", () => {
    // Setup
    const component = {
      id: "ch1",
      type: "chart" as const,
      props: { type: "pie", data: [50, 50] },
    };

    // Act
    const result = SduiChart({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with default type", () => {
    // Setup
    const component = {
      id: "ch1",
      type: "chart" as const,
      props: { data: [5, 10] },
    };

    // Act
    const result = SduiChart({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
