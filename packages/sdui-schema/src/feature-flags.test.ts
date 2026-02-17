import { describe, it, expect } from "vitest";
import {
  featureFlagSchema,
  featureFlagInputSchema,
  featureFlagPatchSchema,
} from "./feature-flags";

describe("featureFlagSchema", () => {
  it("validates a complete feature flag", () => {
    // Act
    const result = featureFlagSchema.safeParse({
      id: "flag_1",
      key: "esim_support",
      description: "Enable eSIM support",
      brandA: true,
      brandB: false,
      brandC: false,
      rolloutPercentage: 100,
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.key).toBe("esim_support");
  });

  it("rejects a rollout percentage over 100", () => {
    // Act
    const result = featureFlagSchema.safeParse({
      id: "flag_1",
      key: "esim_support",
      description: "Enable eSIM support",
      brandA: true,
      brandB: false,
      brandC: false,
      rolloutPercentage: 150,
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects a negative rollout percentage", () => {
    // Act
    const result = featureFlagSchema.safeParse({
      id: "flag_1",
      key: "test",
      description: "Test flag",
      brandA: true,
      brandB: false,
      brandC: false,
      rolloutPercentage: -10,
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("featureFlagInputSchema", () => {
  it("validates input without id", () => {
    // Act
    const result = featureFlagInputSchema.safeParse({
      key: "chat_support",
      description: "Enable chat support",
      brandA: false,
      brandB: true,
      brandC: true,
      rolloutPercentage: 50,
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects input with an id field", () => {
    // Act
    const result = featureFlagInputSchema.safeParse({
      id: "should_not_be_here",
      key: "chat_support",
      description: "Enable chat support",
      brandA: false,
      brandB: true,
      brandC: true,
      rolloutPercentage: 50,
    });

    // Assert — strict parsing rejects extra keys
    const strict = featureFlagInputSchema.strict().safeParse({
      id: "should_not_be_here",
      key: "chat_support",
      description: "Enable chat support",
      brandA: false,
      brandB: true,
      brandC: true,
      rolloutPercentage: 50,
    });
    expect(strict.success).toBe(false);
  });
});

describe("featureFlagPatchSchema", () => {
  it("validates a partial update with only brandA", () => {
    // Act
    const result = featureFlagPatchSchema.safeParse({
      brandA: false,
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.brandA).toBe(false);
  });

  it("validates an empty patch", () => {
    // Act
    const result = featureFlagPatchSchema.safeParse({});

    // Assert
    expect(result.success).toBe(true);
  });
});
