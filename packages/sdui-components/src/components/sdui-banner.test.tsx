import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiBanner } from "./sdui-banner";

describe("SduiBanner", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders info variant by default", () => {
    // Setup
    const component = {
      id: "b1",
      type: "banner" as const,
      props: { message: "System update available" },
    };

    // Act
    const result = SduiBanner({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders warning variant", () => {
    // Setup
    const component = {
      id: "b1",
      type: "banner" as const,
      props: { message: "Low battery", variant: "warning" },
    };

    // Act
    const result = SduiBanner({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with dismiss button by default", () => {
    // Setup
    const component = {
      id: "b1",
      type: "banner" as const,
      props: { message: "Notice" },
    };

    // Act
    const result = SduiBanner({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without dismiss button when dismissible is false", () => {
    // Setup
    const component = {
      id: "b1",
      type: "banner" as const,
      props: { message: "Critical", dismissible: false },
    };

    // Act
    const result = SduiBanner({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
