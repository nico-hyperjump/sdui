import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiDropdown } from "./sdui-dropdown";

describe("SduiDropdown", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with label and options", () => {
    // Setup
    const component = {
      id: "dd1",
      type: "dropdown" as const,
      props: {
        label: "Country",
        options: [
          { label: "US", value: "us" },
          { label: "UK", value: "uk" },
        ],
      },
    };

    // Act
    const result = SduiDropdown({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with selected value", () => {
    // Setup
    const component = {
      id: "dd1",
      type: "dropdown" as const,
      props: {
        options: [
          { label: "US", value: "us" },
          { label: "UK", value: "uk" },
        ],
        selectedValue: "uk",
      },
    };

    // Act
    const result = SduiDropdown({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "dd1",
      type: "dropdown" as const,
      props: { options: [] },
    };

    // Act
    const result = SduiDropdown({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
