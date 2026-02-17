import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiStepIndicator } from "./sdui-step-indicator";

describe("SduiStepIndicator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with steps and current step", () => {
    // Setup
    const component = {
      id: "si1",
      type: "step_indicator" as const,
      props: {
        steps: ["Cart", "Payment", "Confirm"],
        currentStep: 1,
      },
    };

    // Act
    const result = SduiStepIndicator({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty steps", () => {
    // Setup
    const component = {
      id: "si1",
      type: "step_indicator" as const,
      props: { steps: [] },
    };

    // Act
    const result = SduiStepIndicator({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with all steps completed", () => {
    // Setup
    const component = {
      id: "si1",
      type: "step_indicator" as const,
      props: { steps: ["A", "B"], currentStep: 2 },
    };

    // Act
    const result = SduiStepIndicator({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
