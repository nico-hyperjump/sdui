import { describe, it, expect, afterEach, vi } from "vitest";
import { resolveDataSources } from "./data-resolver";
import { DataProviderRegistry } from "./data-provider-registry";
import type { SduiDataSource } from "@workspace/sdui-schema";

describe("resolveDataSources", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves a single data source", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    registry.register("marketing", async () => [{ title: "Offer A" }]);
    const sources: SduiDataSource[] = [{ id: "offers", provider: "marketing" }];
    const context = { brand: "brand_a" };

    // Act
    const result = await resolveDataSources(sources, context, registry);

    // Assert
    expect(result).toEqual({ offers: [{ title: "Offer A" }] });
  });

  it("resolves multiple data sources in parallel", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    registry.register("marketing", async () => [{ title: "Offer" }]);
    registry.register("account", async () => ({ name: "Alice" }));
    const sources: SduiDataSource[] = [
      { id: "offers", provider: "marketing" },
      { id: "user", provider: "account" },
    ];
    const context = { brand: "brand_a", userId: "u1" };

    // Act
    const result = await resolveDataSources(sources, context, registry);

    // Assert
    expect(result).toEqual({
      offers: [{ title: "Offer" }],
      user: { name: "Alice" },
    });
  });

  it("passes params and context to the provider", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    const spy = vi.fn().mockResolvedValue("data");
    registry.register("test", spy);
    const sources: SduiDataSource[] = [
      { id: "d", provider: "test", params: { limit: 5 } },
    ];
    const context = { brand: "brand_b", segment: "postpaid", userId: "u2" };

    // Act
    await resolveDataSources(sources, context, registry);

    // Assert
    expect(spy).toHaveBeenCalledWith({ limit: 5 }, context);
  });

  it("logs warning and skips when provider is not registered", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    const sources: SduiDataSource[] = [
      { id: "missing", provider: "nonexistent" },
    ];
    const logger = vi.fn();

    // Act
    const result = await resolveDataSources(
      sources,
      { brand: "brand_a" },
      registry,
      logger,
    );

    // Assert
    expect(result).toEqual({});
    expect(logger).toHaveBeenCalledWith(
      'Data provider "nonexistent" not found for source "missing"',
    );
  });

  it("logs warning and continues when a provider throws", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    registry.register("failing", async () => {
      throw new Error("network error");
    });
    registry.register("working", async () => "ok");
    const sources: SduiDataSource[] = [
      { id: "bad", provider: "failing" },
      { id: "good", provider: "working" },
    ];
    const logger = vi.fn();

    // Act
    const result = await resolveDataSources(
      sources,
      { brand: "brand_a" },
      registry,
      logger,
    );

    // Assert
    expect(result).toEqual({ good: "ok" });
    expect(logger).toHaveBeenCalledWith(
      'Data provider "failing" failed for source "bad": network error',
    );
  });

  it("returns empty map for empty dataSources array", async () => {
    // Setup
    const registry = new DataProviderRegistry();

    // Act
    const result = await resolveDataSources([], { brand: "brand_a" }, registry);

    // Assert
    expect(result).toEqual({});
  });

  it("uses empty object when source params are undefined", async () => {
    // Setup
    const registry = new DataProviderRegistry();
    const spy = vi.fn().mockResolvedValue("data");
    registry.register("test", spy);
    const sources: SduiDataSource[] = [{ id: "d", provider: "test" }];

    // Act
    await resolveDataSources(sources, { brand: "brand_a" }, registry);

    // Assert
    expect(spy).toHaveBeenCalledWith({}, { brand: "brand_a" });
  });
});
