import { describe, it, expect } from "vitest";
import { SDUI_COMPONENT_TYPES } from "@workspace/sdui-schema";
import { mobileComponentMap } from "./component-map";

describe("mobileComponentMap", () => {
  it("has an entry for every SDUI component type defined in the schema", () => {
    // Act
    const mapKeys = Object.keys(mobileComponentMap);

    // Assert
    for (const type of SDUI_COMPONENT_TYPES) {
      expect(mapKeys).toContain(type);
    }
  });

  it("has no extra keys beyond those in the schema", () => {
    // Act
    const mapKeys = Object.keys(mobileComponentMap);

    // Assert
    expect(mapKeys).toHaveLength(SDUI_COMPONENT_TYPES.length);
  });

  it("maps every type to a function", () => {
    // Assert
    for (const type of SDUI_COMPONENT_TYPES) {
      expect(typeof mobileComponentMap[type]).toBe("function");
    }
  });
});
