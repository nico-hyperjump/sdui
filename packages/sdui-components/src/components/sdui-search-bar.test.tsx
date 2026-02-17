import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSearchBar } from "./sdui-search-bar";

describe("SduiSearchBar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with default placeholder", () => {
    // Setup
    const component = { id: "sb1", type: "search_bar" as const, props: {} };

    // Act
    const result = SduiSearchBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with custom placeholder", () => {
    // Setup
    const component = {
      id: "sb1",
      type: "search_bar" as const,
      props: { placeholder: "Find products..." },
    };

    // Act
    const result = SduiSearchBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with navigate action", () => {
    // Setup
    const component = {
      id: "sb1",
      type: "search_bar" as const,
      props: {},
      action: { type: "navigate" as const, screen: "/search" },
    };

    // Act
    const result = SduiSearchBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
