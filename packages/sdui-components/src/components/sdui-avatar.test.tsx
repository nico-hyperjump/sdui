import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiAvatar } from "./sdui-avatar";

describe("SduiAvatar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with image uri", () => {
    // Setup
    const component = {
      id: "av1",
      type: "avatar" as const,
      props: { uri: "https://example.com/avatar.jpg", size: 48 },
    };

    // Act
    const result = SduiAvatar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders fallback initials when no image", () => {
    // Setup
    const component = {
      id: "av1",
      type: "avatar" as const,
      props: { fallbackInitials: "JD", size: 48 },
    };

    // Act
    const result = SduiAvatar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("uses default size when not provided", () => {
    // Setup
    const component = {
      id: "av1",
      type: "avatar" as const,
      props: {},
    };

    // Act
    const result = SduiAvatar({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
