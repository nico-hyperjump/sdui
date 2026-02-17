import { describe, it, expect } from "vitest";
import { SDUI_COMPONENT_TYPES } from "@workspace/sdui-schema";
import { ComponentRegistry } from "./component-registry";
import type {
  SduiComponentMap,
  SduiComponentProps,
} from "./component-registry";

/** Stub component used in tests. */
function StubComponent(_props: SduiComponentProps): null {
  return null;
}

/**
 * Builds a complete SduiComponentMap where every type maps to StubComponent.
 * @returns A fully populated SduiComponentMap.
 */
function buildFullMap(): SduiComponentMap {
  const map = {} as Record<string, typeof StubComponent>;
  for (const type of SDUI_COMPONENT_TYPES) {
    map[type] = StubComponent;
  }
  return map as SduiComponentMap;
}

describe("ComponentRegistry", () => {
  describe("register and get", () => {
    it("returns undefined for an unregistered type", () => {
      // Setup
      const registry = new ComponentRegistry();

      // Act
      const result = registry.get("button");

      // Assert
      expect(result).toBeUndefined();
    });

    it("returns the registered component for a given type", () => {
      // Setup
      const registry = new ComponentRegistry();
      registry.register("text", StubComponent);

      // Act
      const result = registry.get("text");

      // Assert
      expect(result).toBe(StubComponent);
    });
  });

  describe("fromMap", () => {
    it("creates a registry with every SDUI component type registered", () => {
      // Setup
      const map = buildFullMap();

      // Act
      const registry = ComponentRegistry.fromMap(map);

      // Assert
      for (const type of SDUI_COMPONENT_TYPES) {
        expect(registry.get(type)).toBe(StubComponent);
      }
    });

    it("returns a distinct registry instance on each call", () => {
      // Setup
      const map = buildFullMap();

      // Act
      const a = ComponentRegistry.fromMap(map);
      const b = ComponentRegistry.fromMap(map);

      // Assert
      expect(a).not.toBe(b);
    });
  });
});
