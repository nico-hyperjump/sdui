import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiStepper } from "./sdui-stepper";

describe("SduiStepper", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with default value", () => {
    // Setup
    const component = {
      id: "st1",
      type: "stepper" as const,
      props: { value: 1 },
    };

    // Act
    const result = SduiStepper({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with min and max", () => {
    // Setup
    const component = {
      id: "st1",
      type: "stepper" as const,
      props: { value: 5, min: 1, max: 10, step: 1 },
    };

    // Act
    const result = SduiStepper({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with empty props using defaults", () => {
    // Setup
    const component = {
      id: "st1",
      type: "stepper" as const,
      props: {},
    };

    // Act
    const result = SduiStepper({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
