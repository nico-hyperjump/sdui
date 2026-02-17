import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiRadioGroup } from "./sdui-radio-group";

describe("SduiRadioGroup", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders options with selected value", () => {
    // Setup
    const component = {
      id: "rg1",
      type: "radio_group" as const,
      props: {
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
        value: "a",
      },
    };

    // Act
    const result = SduiRadioGroup({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with no initial selection", () => {
    // Setup
    const component = {
      id: "rg1",
      type: "radio_group" as const,
      props: {
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
    };

    // Act
    const result = SduiRadioGroup({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty options", () => {
    // Setup
    const component = {
      id: "rg1",
      type: "radio_group" as const,
      props: { options: [] },
    };

    // Act
    const result = SduiRadioGroup({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
