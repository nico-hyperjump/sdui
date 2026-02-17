import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSocialProof } from "./sdui-social-proof";

describe("SduiSocialProof", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with text", () => {
    // Setup
    const component = {
      id: "sp1",
      type: "social_proof" as const,
      props: { text: "1,234 people bought this" },
    };

    // Act
    const result = SduiSocialProof({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with count", () => {
    // Setup
    const component = {
      id: "sp1",
      type: "social_proof" as const,
      props: { count: 5000 },
    };

    // Act
    const result = SduiSocialProof({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with custom icon", () => {
    // Setup
    const component = {
      id: "sp1",
      type: "social_proof" as const,
      props: { text: "Trending", icon: "📈" },
    };

    // Act
    const result = SduiSocialProof({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty when no text or count", () => {
    // Setup
    const component = {
      id: "sp1",
      type: "social_proof" as const,
      props: {},
    };

    // Act
    const result = SduiSocialProof({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
