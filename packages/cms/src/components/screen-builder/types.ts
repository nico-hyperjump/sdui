import type { LucideIcon } from "lucide-react";
import type { SduiComponent } from "@workspace/sdui-schema";

// ---------------------------------------------------------------------------
// Property field definitions -- drive the dynamic property panel form
// ---------------------------------------------------------------------------

/** Supported input types for property panel form fields. */
export type PropFieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "url"
  | "color"
  | "json";

/**
 * Describes a single editable property on an SDUI component.
 * Used by the property panel to render the correct input widget.
 */
export interface PropFieldDef {
  /** The key in `component.props` this field maps to. */
  name: string;
  /** Human-readable label displayed next to the input. */
  label: string;
  /** Determines which input widget is rendered. */
  type: PropFieldType;
  /** Whether the field is required. Defaults to `false`. */
  required?: boolean;
  /** Default value inserted when the component is first created. */
  defaultValue?: unknown;
  /** Available choices when `type` is `"select"`. */
  options?: { label: string; value: string }[];
}

// ---------------------------------------------------------------------------
// Component metadata -- drives palette grouping and property panel
// ---------------------------------------------------------------------------

/** Category labels used to group components in the palette. */
export type ComponentCategory =
  | "Layout"
  | "Content"
  | "Interactive"
  | "Composite"
  | "Foundation"
  | "Engagement"
  | "Forms"
  | "Specialized";

/**
 * Static metadata for a single SDUI component type.
 * Powers the palette display and property panel form generation.
 */
export interface ComponentMeta {
  /** Human-readable display name (e.g. "Hero Banner"). */
  label: string;
  /** Category for grouping in the palette sidebar. */
  category: ComponentCategory;
  /** Lucide icon rendered alongside the component in the palette and tree. */
  icon: LucideIcon;
  /** Whether this component can contain child components. */
  acceptsChildren: boolean;
  /** Ordered list of editable property definitions. */
  propFields: PropFieldDef[];
}

// ---------------------------------------------------------------------------
// Flattened tree node -- used for rendering the DnD tree
// ---------------------------------------------------------------------------

/**
 * A component node flattened from the recursive `SduiComponent` tree.
 * Used by the tree view to render a flat sortable list with indentation.
 */
export interface FlatNode {
  /** Unique component id (same as `component.id`). */
  id: string;
  /** Nesting depth (0 = root level). */
  depth: number;
  /** Parent component id, or `null` for root-level nodes. */
  parentId: string | null;
  /** Index among siblings. */
  index: number;
  /** Whether child nodes are collapsed in the UI. */
  collapsed: boolean;
  /** Reference to the original component data. */
  component: SduiComponent;
}

// ---------------------------------------------------------------------------
// Builder state and actions -- power the useScreenBuilder reducer
// ---------------------------------------------------------------------------

/**
 * Immutable state managed by the screen builder reducer.
 */
export interface BuilderState {
  /** The root component array (the screen's component tree). */
  components: SduiComponent[];
  /** Id of the currently selected component, or `null` if none. */
  selectedId: string | null;
  /** Set of component ids whose children are collapsed in the tree UI. */
  collapsedIds: Set<string>;
}

/** Adds a new component at a specific position in the tree. */
export interface AddComponentAction {
  type: "ADD_COMPONENT";
  /** Parent id to nest under, or `null` for root level. */
  parentId: string | null;
  /** Insertion index among siblings. */
  index: number;
  /** The component to insert. */
  component: SduiComponent;
}

/** Removes a component (and its subtree) from the tree. */
export interface RemoveComponentAction {
  type: "REMOVE_COMPONENT";
  /** Id of the component to remove. */
  id: string;
}

/** Moves a component to a new position in the tree. */
export interface MoveComponentAction {
  type: "MOVE_COMPONENT";
  /** Id of the component to move. */
  id: string;
  /** New parent id, or `null` for root level. */
  newParentId: string | null;
  /** New index among siblings at the target location. */
  newIndex: number;
}

/** Updates properties on an existing component. */
export interface UpdateComponentAction {
  type: "UPDATE_COMPONENT";
  /** Id of the component to update. */
  id: string;
  /** Partial component fields to merge. */
  updates: Partial<SduiComponent>;
}

/** Selects a component for editing in the property panel. */
export interface SelectComponentAction {
  type: "SELECT_COMPONENT";
  /** Id to select, or `null` to deselect. */
  id: string | null;
}

/** Replaces the entire component tree (e.g. loading from server). */
export interface SetComponentsAction {
  type: "SET_COMPONENTS";
  /** New root component array. */
  components: SduiComponent[];
}

/** Duplicates a component (and its subtree) as the next sibling. */
export interface DuplicateComponentAction {
  type: "DUPLICATE_COMPONENT";
  /** Id of the component to duplicate. */
  id: string;
}

/** Toggles the collapsed state of a tree node. */
export interface ToggleCollapseAction {
  type: "TOGGLE_COLLAPSE";
  /** Id of the component whose children to show/hide. */
  id: string;
}

/** Union of all actions the builder reducer handles. */
export type BuilderAction =
  | AddComponentAction
  | RemoveComponentAction
  | MoveComponentAction
  | UpdateComponentAction
  | SelectComponentAction
  | SetComponentsAction
  | DuplicateComponentAction
  | ToggleCollapseAction;
