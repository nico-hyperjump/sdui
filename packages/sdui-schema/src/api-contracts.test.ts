import { describe, it, expect } from "vitest";
import {
  getScreenQuerySchema,
  getOffersQuerySchema,
  loginRequestSchema,
  screenInputSchema,
  apiKeyInputSchema,
  apiKeyRecordSchema,
  offerSchema,
  copyToBrandsInputSchema,
  copyToBrandsResponseSchema,
} from "./api-contracts";

describe("getScreenQuerySchema", () => {
  it("validates query with all params", () => {
    // Act
    const result = getScreenQuerySchema.safeParse({
      brand: "brand_a",
      user_segment: "postpaid",
      ab_test_group: "variant_a",
      user_id: "user_123",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates query with only brand", () => {
    // Act
    const result = getScreenQuerySchema.safeParse({
      brand: "brand_a",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects query without brand", () => {
    // Act
    const result = getScreenQuerySchema.safeParse({
      user_segment: "prepaid",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("getOffersQuerySchema", () => {
  it("validates query with brand and segment", () => {
    // Act
    const result = getOffersQuerySchema.safeParse({
      brand: "brand_b",
      user_segment: "prepaid",
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("loginRequestSchema", () => {
  it("validates a valid login request", () => {
    // Act
    const result = loginRequestSchema.safeParse({
      email: "admin@example.com",
      password: "secret123",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    // Act
    const result = loginRequestSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    // Act
    const result = loginRequestSchema.safeParse({
      email: "admin@example.com",
      password: "",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("screenInputSchema", () => {
  it("validates a screen creation input", () => {
    // Act
    const result = screenInputSchema.safeParse({
      screenId: "home",
      brand: "brand_a",
      components: JSON.stringify([{ id: "h1", type: "hero_banner" }]),
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates input with segment and published flag", () => {
    // Act
    const result = screenInputSchema.safeParse({
      screenId: "home",
      brand: "brand_a",
      segment: "postpaid",
      components: "[]",
      published: true,
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("offerSchema", () => {
  it("validates a complete offer", () => {
    // Act
    const result = offerSchema.safeParse({
      id: "offer_1",
      title: "50% Off",
      description: "Half price on all plans",
      price: "$25/mo",
      imageUrl: "https://example.com/offer.png",
      badge: "Hot Deal",
      action: { type: "navigate", screen: "plans" },
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a minimal offer", () => {
    // Act
    const result = offerSchema.safeParse({
      id: "offer_2",
      title: "Free Data",
      description: "Get 5GB free",
      price: "Free",
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("apiKeyInputSchema", () => {
  it("validates a key with label only", () => {
    // Act
    const result = apiKeyInputSchema.safeParse({
      label: "Brand A Mobile App",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a key scoped to a brand", () => {
    // Act
    const result = apiKeyInputSchema.safeParse({
      label: "Brand B Key",
      brand: "brand_b",
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("apiKeyRecordSchema", () => {
  it("validates a stored API key record", () => {
    // Act
    const result = apiKeyRecordSchema.safeParse({
      id: "key_1",
      label: "Production Key",
      keyPreview: "sk_...abc",
      brand: null,
      active: true,
      createdAt: "2026-02-12T10:30:00Z",
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("copyToBrandsInputSchema", () => {
  it("validates input with one brand", () => {
    // Act
    const result = copyToBrandsInputSchema.safeParse({
      brands: ["brand_b"],
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates input with multiple brands", () => {
    // Act
    const result = copyToBrandsInputSchema.safeParse({
      brands: ["brand_b", "brand_c"],
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an empty brands array", () => {
    // Act
    const result = copyToBrandsInputSchema.safeParse({
      brands: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects missing brands field", () => {
    // Act
    const result = copyToBrandsInputSchema.safeParse({});

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("copyToBrandsResponseSchema", () => {
  it("validates a response with created screens and no skipped brands", () => {
    // Act
    const result = copyToBrandsResponseSchema.safeParse({
      created: [
        {
          id: "s1",
          screenId: "home",
          brand: "brand_b",
          segment: null,
          components: "[]",
          version: 1,
          published: false,
          createdAt: "2026-02-17T00:00:00Z",
          updatedAt: "2026-02-17T00:00:00Z",
        },
      ],
      skipped: [],
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a response with skipped brands", () => {
    // Act
    const result = copyToBrandsResponseSchema.safeParse({
      created: [],
      skipped: [{ brand: "brand_c", reason: "already_exists" }],
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects response missing created field", () => {
    // Act
    const result = copyToBrandsResponseSchema.safeParse({
      skipped: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });
});
