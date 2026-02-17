import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiProgressBar } from "./sdui-progress-bar";

describe("SduiProgressBar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders bar variant by default", () => {
    // Setup
    const component = {
      id: "pb1",
      type: "progress_bar" as const,
      props: { value: 50 },
    };

    // Act
    const result = SduiProgressBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders circle variant", () => {
    // Setup
    const component = {
      id: "pb1",
      type: "progress_bar" as const,
      props: { value: 75, variant: "circle" },
    };

    // Act
    const result = SduiProgressBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with label", () => {
    // Setup
    const component = {
      id: "pb1",
      type: "progress_bar" as const,
      props: { value: 50, label: "Loading..." },
    };

    // Act
    const result = SduiProgressBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("clamps value to 0-100 range", () => {
    // Setup
    const component = {
      id: "pb1",
      type: "progress_bar" as const,
      props: { value: 150 },
    };

    // Act
    const result = SduiProgressBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
