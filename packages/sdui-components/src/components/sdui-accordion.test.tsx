import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiAccordion } from "./sdui-accordion";

describe("SduiAccordion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders collapsed by default", () => {
    // Setup
    const component = {
      id: "ac1",
      type: "accordion" as const,
      props: { title: "FAQ Question" },
    };

    // Act
    const result = SduiAccordion({ component, children: "Answer text" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders expanded when prop is true", () => {
    // Setup
    const component = {
      id: "ac1",
      type: "accordion" as const,
      props: { title: "Details", expanded: true },
    };

    // Act
    const result = SduiAccordion({ component, children: "Detail content" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without children", () => {
    // Setup
    const component = {
      id: "ac1",
      type: "accordion" as const,
      props: { title: "Section" },
    };

    // Act
    const result = SduiAccordion({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
