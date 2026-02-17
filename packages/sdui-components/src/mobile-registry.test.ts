import { describe, it, expect } from "vitest";
import { SDUI_COMPONENT_TYPES } from "@workspace/sdui-schema";
import { ComponentRegistry } from "@workspace/sdui-sdk";
import { mobileRegistry } from "./mobile-registry";

describe("mobileRegistry", () => {
  it("is an instance of ComponentRegistry", () => {
    // Assert
    expect(mobileRegistry).toBeInstanceOf(ComponentRegistry);
  });

  it("returns a component for every SDUI type in the schema", () => {
    // Assert
    for (const type of SDUI_COMPONENT_TYPES) {
      expect(mobileRegistry.get(type)).toBeDefined();
    }
  });

  it("returns a function (React component) for every SDUI type", () => {
    // Assert
    for (const type of SDUI_COMPONENT_TYPES) {
      expect(typeof mobileRegistry.get(type)).toBe("function");
    }
  });
});
