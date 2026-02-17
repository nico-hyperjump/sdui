import { describe, it, expect } from "vitest";
import { DataProviderRegistry } from "./data-provider-registry";
import type { DataProviderFn } from "./data-provider-registry";

describe("DataProviderRegistry", () => {
  describe("get", () => {
    it("returns undefined for an unregistered provider", () => {
      // Setup
      const registry = new DataProviderRegistry();

      // Act
      const result = registry.get("unknown");

      // Assert
      expect(result).toBeUndefined();
    });

    it("returns the registered provider function", () => {
      // Setup
      const registry = new DataProviderRegistry();
      const provider: DataProviderFn = async () => [1, 2, 3];
      registry.register("offers", provider);

      // Act
      const result = registry.get("offers");

      // Assert
      expect(result).toBe(provider);
    });
  });

  describe("register", () => {
    it("overwrites an existing provider with the same name", () => {
      // Setup
      const registry = new DataProviderRegistry();
      const first: DataProviderFn = async () => "first";
      const second: DataProviderFn = async () => "second";
      registry.register("offers", first);

      // Act
      registry.register("offers", second);

      // Assert
      expect(registry.get("offers")).toBe(second);
    });
  });

  describe("names", () => {
    it("returns empty array when no providers are registered", () => {
      // Setup
      const registry = new DataProviderRegistry();

      // Act
      const result = registry.names();

      // Assert
      expect(result).toEqual([]);
    });

    it("returns all registered provider names", () => {
      // Setup
      const registry = new DataProviderRegistry();
      const stub: DataProviderFn = async () => null;
      registry.register("marketing", stub);
      registry.register("account", stub);

      // Act
      const result = registry.names();

      // Assert
      expect(result).toEqual(["marketing", "account"]);
    });
  });
});
