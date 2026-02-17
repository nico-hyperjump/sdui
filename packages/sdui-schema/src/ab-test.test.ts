import { describe, it, expect } from "vitest";
import {
  abTestSchema,
  abTestInputSchema,
  abTestVariantSchema,
} from "./ab-test";

describe("abTestVariantSchema", () => {
  it("validates a variant with components", () => {
    // Act
    const result = abTestVariantSchema.safeParse({
      id: "var_1",
      testId: "test_1",
      name: "Variant A",
      percentage: 50,
      components: [
        { id: "hero_1", type: "hero_banner", props: { title: "Welcome A" } },
      ],
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Variant A");
  });

  it("rejects a variant with percentage over 100", () => {
    // Act
    const result = abTestVariantSchema.safeParse({
      id: "var_1",
      testId: "test_1",
      name: "Over",
      percentage: 110,
      components: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects a variant with negative percentage", () => {
    // Act
    const result = abTestVariantSchema.safeParse({
      id: "var_1",
      testId: "test_1",
      name: "Negative",
      percentage: -5,
      components: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("abTestSchema", () => {
  it("validates a complete A/B test", () => {
    // Setup
    const test = {
      id: "test_1",
      name: "Home Layout Test",
      screenId: "home",
      brand: "brand_b",
      active: true,
      createdAt: "2026-02-12T10:30:00Z",
      variants: [
        {
          id: "var_a",
          testId: "test_1",
          name: "Variant A",
          percentage: 50,
          components: [{ id: "h1", type: "hero_banner" }],
        },
        {
          id: "var_b",
          testId: "test_1",
          name: "Variant B",
          percentage: 50,
          components: [{ id: "g1", type: "action_grid" }],
        },
      ],
    };

    // Act
    const result = abTestSchema.safeParse(test);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.variants).toHaveLength(2);
  });

  it("rejects a test missing required fields", () => {
    // Act
    const result = abTestSchema.safeParse({
      name: "Incomplete",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("abTestInputSchema", () => {
  it("validates input for creating a new A/B test", () => {
    // Act
    const result = abTestInputSchema.safeParse({
      name: "Plans Layout Test",
      screenId: "plans",
      brand: "brand_a",
      variants: [
        { name: "Control", percentage: 50, components: [] },
        { name: "Treatment", percentage: 50, components: [] },
      ],
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.variants).toHaveLength(2);
  });

  it("rejects input without name", () => {
    // Act
    const result = abTestInputSchema.safeParse({
      screenId: "plans",
      brand: "brand_a",
      variants: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });
});
