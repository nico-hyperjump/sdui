import type { ComponentType, ReactNode } from "react";
import type { SduiComponent, SduiComponentType } from "@workspace/sdui-schema";

/**
 * Props passed to every SDUI component when rendered: the schema node and optional children.
 */
export interface SduiComponentProps {
  /** The component definition from the screen schema. */
  component: SduiComponent;
  /** Rendered child nodes (for layout/container types). */
  children?: ReactNode;
}

/**
 * A complete mapping from every SDUI component type to its React component implementation.
 * TypeScript enforces that every key in SduiComponentType is present -- missing or
 * misspelled keys cause a compile-time error.
 */
export type SduiComponentMap = Record<
  SduiComponentType,
  ComponentType<SduiComponentProps>
>;

/** Placeholder component that renders nothing (real RN components supplied by the app). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- props required by ComponentType<SduiComponentProps>
function Placeholder(_props: SduiComponentProps): null {
  return null;
}

/**
 * Registry mapping SDUI component type strings to React components.
 * Used by SduiRenderer to resolve type -> component.
 */
export class ComponentRegistry {
  private readonly map = new Map<
    SduiComponentType,
    ComponentType<SduiComponentProps>
  >();

  /**
   * Creates a ComponentRegistry pre-populated from a type-safe SduiComponentMap.
   * Because the map is a Record keyed by SduiComponentType, every component type
   * is guaranteed to have an implementation at compile time.
   * @param map - A complete mapping of every SDUI component type to a React component.
   * @returns A new ComponentRegistry with all types registered.
   */
  static fromMap(map: SduiComponentMap): ComponentRegistry {
    const registry = new ComponentRegistry();
    for (const [type, component] of Object.entries(map)) {
      registry.register(type as SduiComponentType, component);
    }
    return registry;
  }

  /**
   * Registers a React component for a given SDUI type.
   * @param type - The SDUI component type string.
   * @param component - React component to render for that type.
   */
  register(
    type: SduiComponentType,
    component: ComponentType<SduiComponentProps>,
  ): void {
    this.map.set(type, component);
  }

  /**
   * Returns the React component for a given SDUI type, or undefined if not registered.
   * @param type - The SDUI component type string.
   * @returns The component or undefined.
   */
  get(type: SduiComponentType): ComponentType<SduiComponentProps> | undefined {
    return this.map.get(type);
  }
}

/**
 * All known SDUI component type strings for the default placeholder registry.
 * This mirrors sduiComponentTypeSchema.options from sdui-schema, kept as a local
 * constant so that sdui-sdk has no runtime dependency on Zod (only type imports).
 */
const SDUI_TYPES: SduiComponentType[] = [
  // Layout
  "stack",
  "row",
  "column",
  "scroll_view",
  "spacer",
  // Content
  "text",
  "image",
  "icon",
  "divider",
  // Interactive
  "button",
  "card",
  "link",
  // Composite
  "hero_banner",
  "action_card",
  "product_card",
  "list_item",
  "action_grid",
  "web_view",
  // Phase 1 — Foundation
  "carousel",
  "section_header",
  "chip",
  "avatar",
  "search_bar",
  "progress_bar",
  "rating",
  "text_input",
  "toggle",
  "dropdown",
  // Phase 2 — Engagement
  "story_circle",
  "video_player",
  "countdown_timer",
  "tab_bar",
  "banner",
  "empty_state",
  "bottom_sheet",
  "accordion",
  // Phase 3 — Forms & Advanced
  "stepper",
  "checkbox",
  "radio_group",
  "slider",
  "date_picker",
  "swipeable_row",
  "floating_action_button",
  "pull_to_refresh",
  // Phase 4 — Specialized
  "map_view",
  "chart",
  "lottie_animation",
  "qr_code",
  "media_gallery",
  "step_indicator",
  "comparison_table",
  "skeleton_loader",
  "social_proof",
];

/**
 * Default registry with placeholder components for all SDUI types.
 * Consumers can replace placeholders via register() or pass a custom registry to SduiRenderer.
 */
export const defaultRegistry = new ComponentRegistry();
for (const type of SDUI_TYPES) {
  defaultRegistry.register(type, Placeholder);
}
