import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiLottieAnimation } from "./sdui-lottie-animation";

describe("SduiLottieAnimation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with source", () => {
    // Setup
    const component = {
      id: "la1",
      type: "lottie_animation" as const,
      props: { source: "https://example.com/anim.json", autoPlay: true, loop: true },
    };

    // Act
    const result = SduiLottieAnimation({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without source", () => {
    // Setup
    const component = {
      id: "la1",
      type: "lottie_animation" as const,
      props: {},
    };

    // Act
    const result = SduiLottieAnimation({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with custom dimensions", () => {
    // Setup
    const component = {
      id: "la1",
      type: "lottie_animation" as const,
      props: { width: 200, height: 200 },
    };

    // Act
    const result = SduiLottieAnimation({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
