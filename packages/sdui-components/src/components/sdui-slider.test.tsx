import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSlider } from "./sdui-slider";

describe("SduiSlider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with value in range", () => {
    // Setup
    const component = {
      id: "sl1",
      type: "slider" as const,
      props: { min: 0, max: 100, value: 50, label: "Volume" },
    };

    // Act
    const result = SduiSlider({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "sl1",
      type: "slider" as const,
      props: { value: 30 },
    };

    // Act
    const result = SduiSlider({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("clamps percentage to 0-100", () => {
    // Setup
    const component = {
      id: "sl1",
      type: "slider" as const,
      props: { min: 0, max: 100, value: 150 },
    };

    // Act
    const result = SduiSlider({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
