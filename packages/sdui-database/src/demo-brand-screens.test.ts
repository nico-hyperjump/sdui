import { describe, it, expect } from "vitest";
import { SDUI_COMPONENT_TYPES } from "@workspace/sdui-schema";
import { buildDemoBrandScreens } from "./demo-brand-screens";

/** Stub image helper that returns a deterministic placeholder URL. */
const stubImg = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/**
 * Recursively collects all `type` values from a component tree.
 *
 * @param components - Parsed component array from the screen JSON.
 * @returns Set of type strings found in the tree.
 */
function collectTypes(components: Array<Record<string, unknown>>): Set<string> {
  const types = new Set<string>();
  for (const comp of components) {
    if (typeof comp["type"] === "string") {
      types.add(comp["type"]);
    }
    if (Array.isArray(comp["children"])) {
      for (const t of collectTypes(
        comp["children"] as Array<Record<string, unknown>>,
      )) {
        types.add(t);
      }
    }
  }
  return types;
}

describe("buildDemoBrandScreens", () => {
  it("returns exactly three screens for brand_demo", () => {
    // Act
    const screens = buildDemoBrandScreens(stubImg);

    // Assert
    expect(screens).toHaveLength(3);
    expect(screens.map((s) => s.screenId)).toEqual([
      "home",
      "plans",
      "account",
    ]);
    expect(screens.every((s) => s.brand === "brand_demo")).toBe(true);
  });

  it("marks all screens as published", () => {
    // Act
    const screens = buildDemoBrandScreens(stubImg);

    // Assert
    expect(screens.every((s) => s.published)).toBe(true);
  });

  it("covers all 53 SDUI component types across the three screens", () => {
    // Setup
    const screens = buildDemoBrandScreens(stubImg);
    const allTypes = new Set<string>();

    // Act
    for (const screen of screens) {
      const components = JSON.parse(screen.components) as Array<
        Record<string, unknown>
      >;
      for (const t of collectTypes(components)) {
        allTypes.add(t);
      }
      if (screen.overlays) {
        const overlays = JSON.parse(screen.overlays) as Array<
          Record<string, unknown>
        >;
        for (const overlay of overlays) {
          if (Array.isArray(overlay["components"])) {
            for (const t of collectTypes(
              overlay["components"] as Array<Record<string, unknown>>,
            )) {
              allTypes.add(t);
            }
          }
        }
      }
    }

    // Assert — every known type must appear
    const expectedTypes = [...SDUI_COMPONENT_TYPES].sort();
    const actualTypes = [...allTypes].sort();

    const missing = expectedTypes.filter((t) => !allTypes.has(t));
    expect(missing).toEqual([]);
    expect(actualTypes).toEqual(expect.arrayContaining(expectedTypes));
  });

  it("does not contain duplicate component IDs within a single screen", () => {
    // Setup
    const screens = buildDemoBrandScreens(stubImg);

    for (const screen of screens) {
      const ids: string[] = [];

      // Act
      const collectIds = (components: Array<Record<string, unknown>>): void => {
        for (const comp of components) {
          if (typeof comp["id"] === "string") {
            ids.push(comp["id"]);
          }
          if (Array.isArray(comp["children"])) {
            collectIds(comp["children"] as Array<Record<string, unknown>>);
          }
        }
      };

      const components = JSON.parse(screen.components) as Array<
        Record<string, unknown>
      >;
      collectIds(components);

      if (screen.overlays) {
        const overlays = JSON.parse(screen.overlays) as Array<
          Record<string, unknown>
        >;
        for (const overlay of overlays) {
          if (Array.isArray(overlay["components"])) {
            collectIds(overlay["components"] as Array<Record<string, unknown>>);
          }
        }
      }

      // Assert
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(duplicates).toEqual([]);
    }
  });

  it("includes data sources on all three screens", () => {
    // Act
    const screens = buildDemoBrandScreens(stubImg);

    // Assert
    for (const screen of screens) {
      expect(screen.dataSources).toBeDefined();
      const ds = JSON.parse(screen.dataSources!) as unknown[];
      expect(ds.length).toBeGreaterThan(0);
    }
  });
});
