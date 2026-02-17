import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiCheckbox } from "./sdui-checkbox";

describe("SduiCheckbox", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders unchecked with label", () => {
    // Setup
    const component = {
      id: "cb1",
      type: "checkbox" as const,
      props: { label: "Agree to terms", value: false },
    };

    // Act
    const result = SduiCheckbox({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders checked state", () => {
    // Setup
    const component = {
      id: "cb1",
      type: "checkbox" as const,
      props: { label: "Remember me", value: true },
    };

    // Act
    const result = SduiCheckbox({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "cb1",
      type: "checkbox" as const,
      props: {},
    };

    // Act
    const result = SduiCheckbox({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
