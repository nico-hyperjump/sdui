import { useReducer, useCallback, useMemo } from "react";
import type { SduiComponent } from "@workspace/sdui-schema";
import type { BuilderState, BuilderAction, FlatNode } from "./types";

// ---------------------------------------------------------------------------
// Tree helper utilities
// ---------------------------------------------------------------------------

/**
 * Generates a short pseudo-random id string for new components.
 * @param prefix - Optional prefix for readability (e.g. "text").
 * @returns A string like `"text_a1b2c3"`.
 */
export function generateId(prefix = "comp"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${rand}`;
}

/**
 * Deep-clones a component tree, assigning new ids to every node.
 * @param component - The root component to clone.
 * @returns A deep copy with freshly generated ids.
 */
export function cloneWithNewIds(component: SduiComponent): SduiComponent {
  return {
    ...component,
    id: generateId(component.type),
    props: component.props ? { ...component.props } : undefined,
    children: component.children?.map(cloneWithNewIds),
    action: component.action ? { ...component.action } : undefined,
    analytics: component.analytics ? { ...component.analytics } : undefined,
    conditions: component.conditions?.map((c) => ({ ...c })),
    repeat: component.repeat ? { ...component.repeat } : undefined,
  };
}

/**
 * Finds a component by id anywhere in the tree.
 * @param components - Root component array to search.
 * @param id - The component id to find.
 * @returns The matching component, or `undefined`.
 */
export function findComponentById(
  components: SduiComponent[],
  id: string,
): SduiComponent | undefined {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.children) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Finds the parent component and the child's index within its children.
 * @param components - Root component array.
 * @param id - The component id to locate.
 * @returns `{ parent, index }` where `parent` is `null` for root-level nodes.
 */
export function findParentAndIndex(
  components: SduiComponent[],
  id: string,
  parent: SduiComponent | null = null,
): { parent: SduiComponent | null; index: number } | undefined {
  for (let i = 0; i < components.length; i++) {
    if (components[i]!.id === id) {
      return { parent, index: i };
    }
    const child = components[i]!;
    if (child.children) {
      const found = findParentAndIndex(child.children, id, child);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Removes a component by id from a tree, returning a new array.
 * @param components - Root component array.
 * @param id - The component id to remove.
 * @returns A shallow-copied tree without the target node.
 */
export function removeComponent(
  components: SduiComponent[],
  id: string,
): SduiComponent[] {
  return components
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      children: c.children ? removeComponent(c.children, id) : undefined,
    }));
}

/**
 * Inserts a component at a specific position in the tree.
 * @param components - Root component array.
 * @param parentId - Parent id to insert into, or `null` for root level.
 * @param index - Insertion index among siblings.
 * @param component - The component to insert.
 * @returns A shallow-copied tree with the new component.
 */
export function insertComponent(
  components: SduiComponent[],
  parentId: string | null,
  index: number,
  component: SduiComponent,
): SduiComponent[] {
  if (parentId === null) {
    const result = [...components];
    result.splice(index, 0, component);
    return result;
  }
  return components.map((c) => {
    if (c.id === parentId) {
      const children = c.children ? [...c.children] : [];
      children.splice(index, 0, component);
      return { ...c, children };
    }
    return c.children
      ? {
          ...c,
          children: insertComponent(c.children, parentId, index, component),
        }
      : c;
  });
}

/**
 * Updates a component by id, merging partial fields.
 * @param components - Root component array.
 * @param id - The component id to update.
 * @param updates - Partial component fields to merge.
 * @returns A shallow-copied tree with the updated component.
 */
export function updateComponent(
  components: SduiComponent[],
  id: string,
  updates: Partial<SduiComponent>,
): SduiComponent[] {
  return components.map((c) => {
    if (c.id === id) {
      return { ...c, ...updates };
    }
    return c.children
      ? { ...c, children: updateComponent(c.children, id, updates) }
      : c;
  });
}

/**
 * Checks whether `ancestorId` is an ancestor of (or the same as) `targetId`.
 * Used to prevent dropping a node into its own subtree.
 * @param components - Root component array.
 * @param ancestorId - Potential ancestor id.
 * @param targetId - Id to check ancestry for.
 * @returns `true` if `ancestorId` is `targetId` or an ancestor of it.
 */
export function isAncestor(
  components: SduiComponent[],
  ancestorId: string,
  targetId: string,
): boolean {
  if (ancestorId === targetId) return true;
  const ancestor = findComponentById(components, ancestorId);
  if (!ancestor?.children) return false;
  return ancestor.children.some(
    (child) => child.id === targetId || isAncestor([child], child.id, targetId),
  );
}

/**
 * Flattens the recursive component tree into a flat array for rendering.
 * Respects the collapsed state to hide children of collapsed nodes.
 * @param components - Root component array.
 * @param collapsedIds - Set of ids whose children are hidden.
 * @param depth - Current nesting depth (internal recursion param).
 * @param parentId - Current parent id (internal recursion param).
 * @returns Ordered flat array of `FlatNode` objects.
 */
export function flattenTree(
  components: SduiComponent[],
  collapsedIds: Set<string>,
  depth = 0,
  parentId: string | null = null,
): FlatNode[] {
  const result: FlatNode[] = [];
  for (let i = 0; i < components.length; i++) {
    const comp = components[i]!;
    const collapsed = collapsedIds.has(comp.id);
    result.push({
      id: comp.id,
      depth,
      parentId,
      index: i,
      collapsed,
      component: comp,
    });
    if (comp.children && !collapsed) {
      result.push(
        ...flattenTree(comp.children, collapsedIds, depth + 1, comp.id),
      );
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

/**
 * Creates the initial builder state from a component array.
 * @param components - Initial components (e.g. loaded from the server).
 * @returns A fresh `BuilderState`.
 */
export function createInitialState(
  components: SduiComponent[] = [],
): BuilderState {
  return {
    components,
    selectedId: null,
    collapsedIds: new Set(),
  };
}

/**
 * Pure reducer function for the screen builder state.
 * Handles all tree manipulation actions immutably.
 * @param state - Current builder state.
 * @param action - The action to apply.
 * @returns New builder state.
 */
export function builderReducer(
  state: BuilderState,
  action: BuilderAction,
): BuilderState {
  switch (action.type) {
    case "ADD_COMPONENT": {
      return {
        ...state,
        components: insertComponent(
          state.components,
          action.parentId,
          action.index,
          action.component,
        ),
        selectedId: action.component.id,
      };
    }
    case "REMOVE_COMPONENT": {
      return {
        ...state,
        components: removeComponent(state.components, action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    }
    case "MOVE_COMPONENT": {
      if (isAncestor(state.components, action.id, action.newParentId ?? "")) {
        return state;
      }
      const without = removeComponent(state.components, action.id);
      const target = findComponentById(state.components, action.id);
      if (!target) return state;
      return {
        ...state,
        components: insertComponent(
          without,
          action.newParentId,
          action.newIndex,
          target,
        ),
      };
    }
    case "UPDATE_COMPONENT": {
      return {
        ...state,
        components: updateComponent(
          state.components,
          action.id,
          action.updates,
        ),
      };
    }
    case "SELECT_COMPONENT": {
      return {
        ...state,
        selectedId: action.id,
      };
    }
    case "SET_COMPONENTS": {
      return {
        ...state,
        components: action.components,
        selectedId: null,
        collapsedIds: new Set(),
      };
    }
    case "DUPLICATE_COMPONENT": {
      const original = findComponentById(state.components, action.id);
      if (!original) return state;
      const location = findParentAndIndex(state.components, action.id);
      if (!location) return state;
      const cloned = cloneWithNewIds(original);
      return {
        ...state,
        components: insertComponent(
          state.components,
          location.parent?.id ?? null,
          location.index + 1,
          cloned,
        ),
        selectedId: cloned.id,
      };
    }
    case "TOGGLE_COLLAPSE": {
      const next = new Set(state.collapsedIds);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { ...state, collapsedIds: next };
    }
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Custom hook encapsulating the screen builder state and tree operations.
 * @param initialComponents - Initial components to populate the builder.
 * @returns `{ state, dispatch, flatNodes, selectedComponent, toJson }`.
 */
export function useScreenBuilder(initialComponents: SduiComponent[] = []) {
  const [state, dispatch] = useReducer(
    builderReducer,
    initialComponents,
    createInitialState,
  );

  const flatNodes = useMemo(
    () => flattenTree(state.components, state.collapsedIds),
    [state.components, state.collapsedIds],
  );

  const selectedComponent = useMemo(
    () =>
      state.selectedId
        ? (findComponentById(state.components, state.selectedId) ?? null)
        : null,
    [state.components, state.selectedId],
  );

  const toJson = useCallback(
    () => JSON.stringify(state.components, null, 2),
    [state.components],
  );

  return { state, dispatch, flatNodes, selectedComponent, toJson };
}
