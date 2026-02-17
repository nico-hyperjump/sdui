import { describe, it, expect, afterEach, vi } from "vitest";
import {
  createMarketingProvider,
  marketingProviderSchema,
} from "./marketing-provider";

describe("createMarketingProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches offers from the marketing source API with brand filter", async () => {
    // Setup
    const mockOffers = [{ title: "Plan A" }, { title: "Plan B" }];
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(mockOffers), { status: 200 }),
      );
    const provider = createMarketingProvider("http://test:3002");

    // Act
    const result = await provider({}, { brand: "brand_a" });

    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://test:3002/api/offers?brand=brand_a",
    );
    expect(result).toEqual(mockOffers);
  });

  it("includes segment in query when present in context", async () => {
    // Setup
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("[]", { status: 200 }));
    const provider = createMarketingProvider("http://test:3002");

    // Act
    await provider({}, { brand: "brand_a", segment: "prepaid" });

    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://test:3002/api/offers?brand=brand_a&segment=prepaid",
    );
  });

  it("respects the limit param", async () => {
    // Setup
    const mockOffers = [{ title: "A" }, { title: "B" }, { title: "C" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockOffers), { status: 200 }),
    );
    const provider = createMarketingProvider("http://test:3002");

    // Act
    const result = await provider({ limit: 2 }, { brand: "brand_a" });

    // Assert
    expect(result).toEqual([{ title: "A" }, { title: "B" }]);
  });

  it("throws when the API returns a non-OK status", async () => {
    // Setup
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Server Error", { status: 500 }),
    );
    const provider = createMarketingProvider("http://test:3002");

    // Act & Assert
    await expect(provider({}, { brand: "brand_a" })).rejects.toThrow(
      "Marketing API returned 500",
    );
  });
});

describe("marketingProviderSchema", () => {
  it("has the correct provider name", () => {
    // Act & Assert
    expect(marketingProviderSchema.name).toBe("marketing");
  });

  it("declares expected offer fields", () => {
    // Act
    const fieldNames = marketingProviderSchema.fields.map((f) => f.name);

    // Assert
    expect(fieldNames).toContain("id");
    expect(fieldNames).toContain("title");
    expect(fieldNames).toContain("description");
    expect(fieldNames).toContain("price");
    expect(fieldNames).toContain("imageUrl");
    expect(fieldNames).toContain("badge");
  });

  it("declares the limit param", () => {
    // Act
    const limitParam = marketingProviderSchema.params?.find(
      (p) => p.name === "limit",
    );

    // Assert
    expect(limitParam).toBeDefined();
    expect(limitParam?.type).toBe("number");
    expect(limitParam?.required).toBe(false);
    expect(limitParam?.defaultValue).toBe(3);
  });
});
