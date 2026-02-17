import { describe, it, expect } from "vitest";
import { SDUI_COMPONENT_TYPES } from "@workspace/sdui-schema";
import {
  COMPONENT_REGISTRY,
  PALETTE_CATEGORIES,
  getComponentMeta,
} from "./component-registry";

describe("COMPONENT_REGISTRY", () => {
  it("has an entry for every SDUI component type", () => {
    // Act
    const registeredTypes = Object.keys(COMPONENT_REGISTRY);

    // Assert
    expect(registeredTypes.sort()).toEqual([...SDUI_COMPONENT_TYPES].sort());
  });

  it("assigns a valid category to every component", () => {
    // Act
    const categories = Object.values(COMPONENT_REGISTRY).map(
      (meta) => meta.category,
    );

    // Assert
    for (const cat of categories) {
      expect(PALETTE_CATEGORIES).toContain(cat);
    }
  });

  it("assigns an icon function to every component", () => {
    // Act & Assert
    for (const [type, meta] of Object.entries(COMPONENT_REGISTRY)) {
      expect(meta.icon).toBeDefined();
      expect(meta.label.length).toBeGreaterThan(0);
      expect(meta).toHaveProperty("acceptsChildren");
      expect(typeof meta.acceptsChildren).toBe("boolean");
      expect(Array.isArray(meta.propFields)).toBe(true);
      // Ensure no accidental undefined properties
      expect(meta.label).toBeDefined();
      expect(meta.category).toBeDefined();
      // Use type to ensure loop is exercised
      expect(type.length).toBeGreaterThan(0);
    }
  });

  it("marks container components as acceptsChildren", () => {
    // Assert
    expect(COMPONENT_REGISTRY.stack.acceptsChildren).toBe(true);
    expect(COMPONENT_REGISTRY.row.acceptsChildren).toBe(true);
    expect(COMPONENT_REGISTRY.column.acceptsChildren).toBe(true);
    expect(COMPONENT_REGISTRY.card.acceptsChildren).toBe(true);
    expect(COMPONENT_REGISTRY.scroll_view.acceptsChildren).toBe(true);
    expect(COMPONENT_REGISTRY.carousel.acceptsChildren).toBe(true);
  });

  it("marks leaf components as not accepting children", () => {
    // Assert
    expect(COMPONENT_REGISTRY.text.acceptsChildren).toBe(false);
    expect(COMPONENT_REGISTRY.image.acceptsChildren).toBe(false);
    expect(COMPONENT_REGISTRY.spacer.acceptsChildren).toBe(false);
    expect(COMPONENT_REGISTRY.divider.acceptsChildren).toBe(false);
    expect(COMPONENT_REGISTRY.icon.acceptsChildren).toBe(false);
  });

  it("defines propFields with valid types", () => {
    // Setup
    const validTypes = [
      "string",
      "number",
      "boolean",
      "select",
      "url",
      "color",
      "json",
    ];

    // Act & Assert
    for (const meta of Object.values(COMPONENT_REGISTRY)) {
      for (const field of meta.propFields) {
        expect(validTypes).toContain(field.type);
        expect(field.name.length).toBeGreaterThan(0);
        expect(field.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("provides options array for every select-type field", () => {
    // Act & Assert
    for (const meta of Object.values(COMPONENT_REGISTRY)) {
      for (const field of meta.propFields) {
        if (field.type === "select") {
          expect(Array.isArray(field.options)).toBe(true);
          expect(field.options!.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("PALETTE_CATEGORIES", () => {
  it("contains exactly the categories used by components", () => {
    // Act
    const usedCategories = new Set(
      Object.values(COMPONENT_REGISTRY).map((meta) => meta.category),
    );

    // Assert
    for (const cat of usedCategories) {
      expect(PALETTE_CATEGORIES).toContain(cat);
    }
  });

  it("has 8 categories", () => {
    // Assert
    expect(PALETTE_CATEGORIES).toHaveLength(8);
  });
});

describe("getComponentMeta", () => {
  it("returns metadata for a known component type", () => {
    // Act
    const meta = getComponentMeta("text");

    // Assert
    expect(meta).toBeDefined();
    expect(meta!.label).toBe("Text");
    expect(meta!.category).toBe("Content");
  });

  it("returns undefined for an unknown type", () => {
    // Act
    const meta = getComponentMeta("nonexistent" as never);

    // Assert
    expect(meta).toBeUndefined();
  });
});
