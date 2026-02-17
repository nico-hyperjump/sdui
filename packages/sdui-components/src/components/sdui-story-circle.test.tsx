import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiStoryCircle } from "./sdui-story-circle";

describe("SduiStoryCircle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with image and label", () => {
    // Setup
    const component = {
      id: "sc1",
      type: "story_circle" as const,
      props: { imageUri: "https://example.com/pic.jpg", label: "Story" },
    };

    // Act
    const result = SduiStoryCircle({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders seen state with different border color", () => {
    // Setup
    const component = {
      id: "sc1",
      type: "story_circle" as const,
      props: { imageUri: "https://example.com/pic.jpg", seen: true },
    };

    // Act
    const result = SduiStoryCircle({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "sc1",
      type: "story_circle" as const,
      props: { imageUri: "https://example.com/pic.jpg" },
    };

    // Act
    const result = SduiStoryCircle({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without image", () => {
    // Setup
    const component = {
      id: "sc1",
      type: "story_circle" as const,
      props: {},
    };

    // Act
    const result = SduiStoryCircle({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
