import { describe, it, expect } from "vitest";
import { DataProviderSchemaRegistry } from "./provider-schema";
import type { DataProviderSchema } from "./provider-schema";

/** Creates a minimal provider schema for testing. */
function createSchema(
  overrides?: Partial<DataProviderSchema>,
): DataProviderSchema {
  return {
    name: "test",
    label: "Test Provider",
    description: "A test provider",
    fields: [{ name: "value", label: "Value", type: "string" }],
    ...overrides,
  };
}

describe("DataProviderSchemaRegistry", () => {
  describe("get", () => {
    it("returns undefined for an unregistered provider", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();

      // Act
      const result = registry.get("unknown");

      // Assert
      expect(result).toBeUndefined();
    });

    it("returns the registered schema", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      const schema = createSchema({ name: "account" });
      registry.register(schema);

      // Act
      const result = registry.get("account");

      // Assert
      expect(result).toBe(schema);
    });
  });

  describe("register", () => {
    it("overwrites an existing schema with the same name", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      const first = createSchema({ name: "account", label: "First" });
      const second = createSchema({ name: "account", label: "Second" });
      registry.register(first);

      // Act
      registry.register(second);

      // Assert
      expect(registry.get("account")).toBe(second);
    });

    it("uses the schema name as the registry key", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      const schema = createSchema({ name: "marketing" });

      // Act
      registry.register(schema);

      // Assert
      expect(registry.get("marketing")?.label).toBe("Test Provider");
    });
  });

  describe("getAll", () => {
    it("returns empty array when no schemas are registered", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();

      // Act
      const result = registry.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("returns all registered schemas", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      const account = createSchema({ name: "account", label: "Account" });
      const marketing = createSchema({ name: "marketing", label: "Marketing" });
      registry.register(account);
      registry.register(marketing);

      // Act
      const result = registry.getAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContain(account);
      expect(result).toContain(marketing);
    });

    it("returns a new array on each call (no mutation risk)", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      registry.register(createSchema({ name: "a" }));

      // Act
      const first = registry.getAll();
      const second = registry.getAll();

      // Assert
      expect(first).not.toBe(second);
      expect(first).toEqual(second);
    });
  });

  describe("names", () => {
    it("returns empty array when no schemas are registered", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();

      // Act
      const result = registry.names();

      // Assert
      expect(result).toEqual([]);
    });

    it("returns all registered schema names", () => {
      // Setup
      const registry = new DataProviderSchemaRegistry();
      registry.register(createSchema({ name: "marketing" }));
      registry.register(createSchema({ name: "account" }));

      // Act
      const result = registry.names();

      // Assert
      expect(result).toEqual(["marketing", "account"]);
    });
  });
});
