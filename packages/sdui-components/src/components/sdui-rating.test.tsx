import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiRating } from "./sdui-rating";

describe("SduiRating", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with default 5 stars", () => {
    // Setup
    const component = {
      id: "r1",
      type: "rating" as const,
      props: { value: 3 },
    };

    // Act
    const result = SduiRating({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders custom number of stars", () => {
    // Setup
    const component = {
      id: "r1",
      type: "rating" as const,
      props: { value: 2, maxStars: 10 },
    };

    // Act
    const result = SduiRating({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders interactive stars", () => {
    // Setup
    const component = {
      id: "r1",
      type: "rating" as const,
      props: { value: 4, interactive: true },
    };

    // Act
    const result = SduiRating({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
