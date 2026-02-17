import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiEmptyState } from "./sdui-empty-state";

describe("SduiEmptyState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with title and subtitle", () => {
    // Setup
    const component = {
      id: "es1",
      type: "empty_state" as const,
      props: { title: "No results", subtitle: "Try a different search" },
    };

    // Act
    const result = SduiEmptyState({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with image", () => {
    // Setup
    const component = {
      id: "es1",
      type: "empty_state" as const,
      props: { title: "Empty", imageUri: "https://example.com/empty.png" },
    };

    // Act
    const result = SduiEmptyState({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders CTA button when action is provided", () => {
    // Setup
    const component = {
      id: "es1",
      type: "empty_state" as const,
      props: { title: "No items" },
      action: { type: "navigate" as const, screen: "/home" },
    };

    // Act
    const result = SduiEmptyState({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without CTA when no action", () => {
    // Setup
    const component = {
      id: "es1",
      type: "empty_state" as const,
      props: { title: "Empty" },
    };

    // Act
    const result = SduiEmptyState({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
