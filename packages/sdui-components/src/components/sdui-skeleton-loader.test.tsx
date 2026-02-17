import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSkeletonLoader } from "./sdui-skeleton-loader";

describe("SduiSkeletonLoader", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders text variant with lines", () => {
    // Setup
    const component = {
      id: "sk1",
      type: "skeleton_loader" as const,
      props: { variant: "text", lines: 4 },
    };

    // Act
    const result = SduiSkeletonLoader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders image variant", () => {
    // Setup
    const component = {
      id: "sk1",
      type: "skeleton_loader" as const,
      props: { variant: "image" },
    };

    // Act
    const result = SduiSkeletonLoader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders card variant", () => {
    // Setup
    const component = {
      id: "sk1",
      type: "skeleton_loader" as const,
      props: { variant: "card" },
    };

    // Act
    const result = SduiSkeletonLoader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders default text variant with 3 lines", () => {
    // Setup
    const component = {
      id: "sk1",
      type: "skeleton_loader" as const,
      props: {},
    };

    // Act
    const result = SduiSkeletonLoader({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
