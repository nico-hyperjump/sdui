import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiPullToRefresh } from "./sdui-pull-to-refresh";

describe("SduiPullToRefresh", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with children", () => {
    // Setup
    const component = {
      id: "ptr1",
      type: "pull_to_refresh" as const,
      props: {},
    };

    // Act
    const result = SduiPullToRefresh({ component, children: "Scrollable content" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without children", () => {
    // Setup
    const component = {
      id: "ptr1",
      type: "pull_to_refresh" as const,
      props: {},
    };

    // Act
    const result = SduiPullToRefresh({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
