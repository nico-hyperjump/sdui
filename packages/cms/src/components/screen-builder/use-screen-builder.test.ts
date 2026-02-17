import { describe, it, expect } from "vitest";
import type { SduiComponent } from "@workspace/sdui-schema";
import type { BuilderState } from "./types";
import {
  generateId,
  cloneWithNewIds,
  findComponentById,
  findParentAndIndex,
  removeComponent,
  insertComponent,
  updateComponent,
  isAncestor,
  flattenTree,
  createInitialState,
  builderReducer,
} from "./use-screen-builder";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeComponent(
  overrides: Partial<SduiComponent> & {
    id: string;
    type: SduiComponent["type"];
  },
): SduiComponent {
  return { ...overrides };
}

function makeSampleTree(): SduiComponent[] {
  return [
    makeComponent({
      id: "stack_1",
      type: "stack",
      children: [
        makeComponent({
          id: "text_1",
          type: "text",
          props: { content: "Hello" },
        }),
        makeComponent({
          id: "button_1",
          type: "button",
          props: { label: "Click" },
        }),
      ],
    }),
    makeComponent({
      id: "image_1",
      type: "image",
      props: { uri: "https://x.png" },
    }),
  ];
}

function makeState(overrides?: Partial<BuilderState>): BuilderState {
  return {
    components: makeSampleTree(),
    selectedId: null,
    collapsedIds: new Set(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// generateId
// ---------------------------------------------------------------------------

describe("generateId", () => {
  it("returns a string with the given prefix", () => {
    // Act
    const id = generateId("text");

    // Assert
    expect(id).toMatch(/^text_[a-z0-9]+$/);
  });

  it("uses default prefix when none provided", () => {
    // Act
    const id = generateId();

    // Assert
    expect(id).toMatch(/^comp_[a-z0-9]+$/);
  });

  it("generates unique ids on subsequent calls", () => {
    // Act
    const a = generateId();
    const b = generateId();

    // Assert
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// cloneWithNewIds
// ---------------------------------------------------------------------------

describe("cloneWithNewIds", () => {
  it("returns a deep copy with different ids", () => {
    // Setup
    const original = makeComponent({
      id: "stack_1",
      type: "stack",
      props: { gap: 8 },
      children: [
        makeComponent({ id: "text_1", type: "text", props: { content: "Hi" } }),
      ],
    });

    // Act
    const cloned = cloneWithNewIds(original);

    // Assert
    expect(cloned.id).not.toBe(original.id);
    expect(cloned.children![0]!.id).not.toBe(original.children![0]!.id);
    expect(cloned.type).toBe("stack");
    expect(cloned.children![0]!.type).toBe("text");
    expect(cloned.props).toEqual({ gap: 8 });
  });

  it("preserves action, analytics, conditions, and repeat", () => {
    // Setup
    const original = makeComponent({
      id: "btn_1",
      type: "button",
      action: { type: "navigate", screen: "home" },
      analytics: { click: "btn_click" },
      conditions: [
        { field: "brand", operator: "eq" as const, value: "brand_a" },
      ],
      repeat: { source: "items", as: "item" },
    });

    // Act
    const cloned = cloneWithNewIds(original);

    // Assert
    expect(cloned.action).toEqual({ type: "navigate", screen: "home" });
    expect(cloned.analytics).toEqual({ click: "btn_click" });
    expect(cloned.conditions).toEqual([
      { field: "brand", operator: "eq", value: "brand_a" },
    ]);
    expect(cloned.repeat).toEqual({ source: "items", as: "item" });
  });
});

// ---------------------------------------------------------------------------
// findComponentById
// ---------------------------------------------------------------------------

describe("findComponentById", () => {
  it("finds a root-level component", () => {
    // Setup
    const tree = makeSampleTree();

    // Act
    const found = findComponentById(tree, "image_1");

    // Assert
    expect(found).toBeDefined();
    expect(found!.type).toBe("image");
  });

  it("finds a deeply nested component", () => {
    // Setup
    const tree = makeSampleTree();

    // Act
    const found = findComponentById(tree, "text_1");

    // Assert
    expect(found).toBeDefined();
    expect(found!.props).toEqual({ content: "Hello" });
  });

  it("returns undefined for a missing id", () => {
    // Act
    const found = findComponentById(makeSampleTree(), "nonexistent");

    // Assert
    expect(found).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// findParentAndIndex
// ---------------------------------------------------------------------------

describe("findParentAndIndex", () => {
  it("returns null parent and correct index for root-level node", () => {
    // Act
    const result = findParentAndIndex(makeSampleTree(), "image_1");

    // Assert
    expect(result).toBeDefined();
    expect(result!.parent).toBeNull();
    expect(result!.index).toBe(1);
  });

  it("returns parent and index for nested node", () => {
    // Act
    const result = findParentAndIndex(makeSampleTree(), "button_1");

    // Assert
    expect(result).toBeDefined();
    expect(result!.parent!.id).toBe("stack_1");
    expect(result!.index).toBe(1);
  });

  it("returns undefined for missing id", () => {
    // Act
    const result = findParentAndIndex(makeSampleTree(), "missing");

    // Assert
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// removeComponent
// ---------------------------------------------------------------------------

describe("removeComponent", () => {
  it("removes a root-level component", () => {
    // Act
    const result = removeComponent(makeSampleTree(), "image_1");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("stack_1");
  });

  it("removes a nested component", () => {
    // Act
    const result = removeComponent(makeSampleTree(), "text_1");

    // Assert
    expect(result[0]!.children).toHaveLength(1);
    expect(result[0]!.children![0]!.id).toBe("button_1");
  });

  it("returns unchanged tree when id not found", () => {
    // Setup
    const tree = makeSampleTree();

    // Act
    const result = removeComponent(tree, "missing");

    // Assert
    expect(result).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// insertComponent
// ---------------------------------------------------------------------------

describe("insertComponent", () => {
  it("inserts at root level", () => {
    // Setup
    const newComp = makeComponent({ id: "divider_1", type: "divider" });

    // Act
    const result = insertComponent(makeSampleTree(), null, 1, newComp);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[1]!.id).toBe("divider_1");
  });

  it("inserts into a parent's children", () => {
    // Setup
    const newComp = makeComponent({ id: "icon_1", type: "icon" });

    // Act
    const result = insertComponent(makeSampleTree(), "stack_1", 0, newComp);

    // Assert
    expect(result[0]!.children).toHaveLength(3);
    expect(result[0]!.children![0]!.id).toBe("icon_1");
  });

  it("creates children array when parent has none", () => {
    // Setup
    const tree = [makeComponent({ id: "card_1", type: "card" })];
    const newComp = makeComponent({ id: "text_1", type: "text" });

    // Act
    const result = insertComponent(tree, "card_1", 0, newComp);

    // Assert
    expect(result[0]!.children).toHaveLength(1);
    expect(result[0]!.children![0]!.id).toBe("text_1");
  });
});

// ---------------------------------------------------------------------------
// updateComponent
// ---------------------------------------------------------------------------

describe("updateComponent", () => {
  it("updates props on a root-level component", () => {
    // Act
    const result = updateComponent(makeSampleTree(), "image_1", {
      props: { uri: "https://new.png" },
    });

    // Assert
    expect(result[1]!.props).toEqual({ uri: "https://new.png" });
  });

  it("updates props on a nested component", () => {
    // Act
    const result = updateComponent(makeSampleTree(), "text_1", {
      props: { content: "Updated" },
    });

    // Assert
    expect(result[0]!.children![0]!.props).toEqual({ content: "Updated" });
  });
});

// ---------------------------------------------------------------------------
// isAncestor
// ---------------------------------------------------------------------------

describe("isAncestor", () => {
  it("returns true for same id", () => {
    // Act & Assert
    expect(isAncestor(makeSampleTree(), "stack_1", "stack_1")).toBe(true);
  });

  it("returns true when id is a direct child", () => {
    // Act & Assert
    expect(isAncestor(makeSampleTree(), "stack_1", "text_1")).toBe(true);
  });

  it("returns false for unrelated nodes", () => {
    // Act & Assert
    expect(isAncestor(makeSampleTree(), "image_1", "text_1")).toBe(false);
  });

  it("returns false when ancestor has no children", () => {
    // Act & Assert
    expect(isAncestor(makeSampleTree(), "text_1", "stack_1")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// flattenTree
// ---------------------------------------------------------------------------

describe("flattenTree", () => {
  it("flattens a tree to a flat node array", () => {
    // Act
    const flat = flattenTree(makeSampleTree(), new Set());

    // Assert
    expect(flat).toHaveLength(4);
    expect(flat[0]!.id).toBe("stack_1");
    expect(flat[0]!.depth).toBe(0);
    expect(flat[1]!.id).toBe("text_1");
    expect(flat[1]!.depth).toBe(1);
    expect(flat[1]!.parentId).toBe("stack_1");
    expect(flat[3]!.id).toBe("image_1");
    expect(flat[3]!.depth).toBe(0);
  });

  it("hides children of collapsed nodes", () => {
    // Act
    const flat = flattenTree(makeSampleTree(), new Set(["stack_1"]));

    // Assert
    expect(flat).toHaveLength(2);
    expect(flat[0]!.id).toBe("stack_1");
    expect(flat[0]!.collapsed).toBe(true);
    expect(flat[1]!.id).toBe("image_1");
  });

  it("returns empty array for empty tree", () => {
    // Act
    const flat = flattenTree([], new Set());

    // Assert
    expect(flat).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

describe("createInitialState", () => {
  it("creates state with provided components", () => {
    // Setup
    const comps = makeSampleTree();

    // Act
    const state = createInitialState(comps);

    // Assert
    expect(state.components).toBe(comps);
    expect(state.selectedId).toBeNull();
    expect(state.collapsedIds.size).toBe(0);
  });

  it("defaults to empty components array", () => {
    // Act
    const state = createInitialState();

    // Assert
    expect(state.components).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// builderReducer
// ---------------------------------------------------------------------------

describe("builderReducer", () => {
  it("handles ADD_COMPONENT and selects the new component", () => {
    // Setup
    const state = makeState();
    const newComp = makeComponent({ id: "new_1", type: "divider" });

    // Act
    const next = builderReducer(state, {
      type: "ADD_COMPONENT",
      parentId: null,
      index: 0,
      component: newComp,
    });

    // Assert
    expect(next.components).toHaveLength(3);
    expect(next.components[0]!.id).toBe("new_1");
    expect(next.selectedId).toBe("new_1");
  });

  it("handles REMOVE_COMPONENT and clears selection if removed", () => {
    // Setup
    const state = makeState({ selectedId: "text_1" });

    // Act
    const next = builderReducer(state, {
      type: "REMOVE_COMPONENT",
      id: "text_1",
    });

    // Assert
    expect(findComponentById(next.components, "text_1")).toBeUndefined();
    expect(next.selectedId).toBeNull();
  });

  it("handles REMOVE_COMPONENT and keeps selection if different", () => {
    // Setup
    const state = makeState({ selectedId: "image_1" });

    // Act
    const next = builderReducer(state, {
      type: "REMOVE_COMPONENT",
      id: "text_1",
    });

    // Assert
    expect(next.selectedId).toBe("image_1");
  });

  it("handles MOVE_COMPONENT to root", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "MOVE_COMPONENT",
      id: "text_1",
      newParentId: null,
      newIndex: 2,
    });

    // Assert
    expect(next.components).toHaveLength(3);
    expect(next.components[2]!.id).toBe("text_1");
    expect(next.components[0]!.children).toHaveLength(1);
  });

  it("prevents MOVE_COMPONENT into own subtree", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "MOVE_COMPONENT",
      id: "stack_1",
      newParentId: "text_1",
      newIndex: 0,
    });

    // Assert
    expect(next).toBe(state);
  });

  it("returns same state when MOVE_COMPONENT target not found", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "MOVE_COMPONENT",
      id: "nonexistent",
      newParentId: null,
      newIndex: 0,
    });

    // Assert
    expect(next).toBe(state);
  });

  it("handles UPDATE_COMPONENT", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { props: { content: "Updated" } },
    });

    // Assert
    const updated = findComponentById(next.components, "text_1");
    expect(updated!.props).toEqual({ content: "Updated" });
  });

  it("handles SELECT_COMPONENT", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "SELECT_COMPONENT",
      id: "text_1",
    });

    // Assert
    expect(next.selectedId).toBe("text_1");
  });

  it("handles SELECT_COMPONENT with null to deselect", () => {
    // Setup
    const state = makeState({ selectedId: "text_1" });

    // Act
    const next = builderReducer(state, {
      type: "SELECT_COMPONENT",
      id: null,
    });

    // Assert
    expect(next.selectedId).toBeNull();
  });

  it("handles SET_COMPONENTS and resets selection", () => {
    // Setup
    const state = makeState({ selectedId: "text_1" });
    const newComps = [makeComponent({ id: "new_1", type: "text" })];

    // Act
    const next = builderReducer(state, {
      type: "SET_COMPONENTS",
      components: newComps,
    });

    // Assert
    expect(next.components).toBe(newComps);
    expect(next.selectedId).toBeNull();
    expect(next.collapsedIds.size).toBe(0);
  });

  it("handles DUPLICATE_COMPONENT", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "DUPLICATE_COMPONENT",
      id: "image_1",
    });

    // Assert
    expect(next.components).toHaveLength(3);
    expect(next.components[2]!.type).toBe("image");
    expect(next.components[2]!.id).not.toBe("image_1");
    expect(next.selectedId).toBe(next.components[2]!.id);
  });

  it("handles DUPLICATE_COMPONENT for nested component", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "DUPLICATE_COMPONENT",
      id: "text_1",
    });

    // Assert
    expect(next.components[0]!.children).toHaveLength(3);
    expect(next.components[0]!.children![1]!.type).toBe("text");
    expect(next.components[0]!.children![1]!.id).not.toBe("text_1");
  });

  it("returns same state when DUPLICATE_COMPONENT target not found", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "DUPLICATE_COMPONENT",
      id: "missing",
    });

    // Assert
    expect(next).toBe(state);
  });

  it("handles TOGGLE_COLLAPSE to collapse", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, {
      type: "TOGGLE_COLLAPSE",
      id: "stack_1",
    });

    // Assert
    expect(next.collapsedIds.has("stack_1")).toBe(true);
  });

  it("handles TOGGLE_COLLAPSE to expand", () => {
    // Setup
    const state = makeState({ collapsedIds: new Set(["stack_1"]) });

    // Act
    const next = builderReducer(state, {
      type: "TOGGLE_COLLAPSE",
      id: "stack_1",
    });

    // Assert
    expect(next.collapsedIds.has("stack_1")).toBe(false);
  });

  it("returns state unchanged for unknown action type", () => {
    // Setup
    const state = makeState();

    // Act
    const next = builderReducer(state, { type: "UNKNOWN" } as never);

    // Assert
    expect(next).toBe(state);
  });
});
