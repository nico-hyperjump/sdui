import { z } from "zod";

// ---------------------------------------------------------------------------
// Action definitions -- what happens when a user taps a component
// ---------------------------------------------------------------------------

/** Schema for a navigation action that moves the user to another screen. */
export const sduiNavigateActionSchema = z.object({
  type: z.literal("navigate"),
  screen: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
});

/** Schema for an action that opens a URL in a WebView or external browser. */
export const sduiWebViewActionSchema = z.object({
  type: z.literal("webview"),
  url: z.string().url(),
  title: z.string().optional(),
});

/** Schema for a custom application-defined action. */
export const sduiCustomActionSchema = z.object({
  type: z.literal("custom"),
  name: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

/** Schema for an action that shows a screen-level overlay. */
export const sduiShowOverlayActionSchema = z.object({
  type: z.literal("show_overlay"),
  /** Identifier of the overlay to show (must match an entry in the screen's overlays array). */
  overlayId: z.string(),
});

/** Schema for an action that dismisses a screen-level overlay. */
export const sduiDismissOverlayActionSchema = z.object({
  type: z.literal("dismiss_overlay"),
  /** Identifier of the overlay to dismiss. When omitted, dismisses the topmost visible overlay. */
  overlayId: z.string().optional(),
});

/** Union schema for all supported SDUI action types. */
export const sduiActionSchema = z.discriminatedUnion("type", [
  sduiNavigateActionSchema,
  sduiWebViewActionSchema,
  sduiCustomActionSchema,
  sduiShowOverlayActionSchema,
  sduiDismissOverlayActionSchema,
]);

/** An action a user can trigger from a component. */
export type SduiAction = z.infer<typeof sduiActionSchema>;

// ---------------------------------------------------------------------------
// Analytics metadata attached to components
// ---------------------------------------------------------------------------

/** Schema for analytics tracking metadata on a component. */
export const sduiAnalyticsMetadataSchema = z.object({
  impression: z.string().optional(),
  click: z.string().optional(),
});

/** Analytics tracking metadata attached to a component. */
export type SduiAnalyticsMetadata = z.infer<typeof sduiAnalyticsMetadataSchema>;

// ---------------------------------------------------------------------------
// Conditional visibility
// ---------------------------------------------------------------------------

/** Schema for a condition controlling component visibility. */
export const sduiConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "neq", "in", "not_in", "gt", "lt"]),
  value: z.unknown(),
});

/** A condition that determines whether a component is rendered. */
export type SduiCondition = z.infer<typeof sduiConditionSchema>;

// ---------------------------------------------------------------------------
// Data source declarations -- where component data comes from
// ---------------------------------------------------------------------------

/**
 * Schema for a data source declaration on a screen. Each data source references
 * a named provider that the server resolves at request time. The resolved data
 * is injected into component props via template expressions.
 */
export const sduiDataSourceSchema = z.object({
  /** Identifier referenced in template expressions, e.g. "offers". */
  id: z.string(),
  /** Name of the registered server-side data provider. */
  provider: z.string(),
  /** Optional parameters forwarded to the provider function. */
  params: z.record(z.string(), z.unknown()).optional(),
});

/** A data source declaration that tells the server what data to fetch for a screen. */
export type SduiDataSource = z.infer<typeof sduiDataSourceSchema>;

// ---------------------------------------------------------------------------
// Repeat directive -- render a component once per item in a data array
// ---------------------------------------------------------------------------

/**
 * Schema for a repeat directive on a component. When present, the server
 * clones the component once per item in the referenced data source array
 * and exposes each item under the given alias for template expressions.
 */
export const sduiRepeatSchema = z.object({
  /** Data source id or dot-path to an array value in the resolved data. */
  source: z.string(),
  /** Variable name used in child template expressions, e.g. "offer". */
  as: z.string(),
});

/** A repeat directive that expands a template component into a list. */
export type SduiRepeat = z.infer<typeof sduiRepeatSchema>;

// ---------------------------------------------------------------------------
// Overlay definitions -- screen-level modals, bottom sheets, and fullscreen
// ---------------------------------------------------------------------------

/** Schema for how an overlay is presented visually. */
export const sduiOverlayStyleSchema = z.enum([
  "modal",
  "bottom_sheet",
  "fullscreen",
]);

/** Visual presentation style for an overlay. */
export type SduiOverlayStyle = z.infer<typeof sduiOverlayStyleSchema>;

/** Schema for the trigger that controls when an overlay is shown. */
export const sduiOverlayTriggerSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("manual") }),
  z.object({ type: z.literal("on_load") }),
]);

/** Trigger configuration for an overlay. */
export type SduiOverlayTrigger = z.infer<typeof sduiOverlayTriggerSchema>;

// ---------------------------------------------------------------------------
// Component definitions
// ---------------------------------------------------------------------------

/**
 * All component types supported by the SDUI renderer.
 * Layout, content, interactive, and composite categories.
 */
export const sduiComponentTypeSchema = z.enum([
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
]);

/** Supported SDUI component type string. */
export type SduiComponentType = z.infer<typeof sduiComponentTypeSchema>;

/**
 * Runtime array of all supported SDUI component type strings.
 * Derived from the Zod enum so it stays in sync with the schema automatically.
 */
export const SDUI_COMPONENT_TYPES = sduiComponentTypeSchema.options;

/** Base schema for a single SDUI component (recursive via children). */
export const sduiComponentSchema: z.ZodType<SduiComponent> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: sduiComponentTypeSchema,
    props: z.record(z.string(), z.unknown()).optional(),
    children: z.array(sduiComponentSchema).optional(),
    action: sduiActionSchema.optional(),
    analytics: sduiAnalyticsMetadataSchema.optional(),
    conditions: z.array(sduiConditionSchema).optional(),
    repeat: sduiRepeatSchema.optional(),
  }),
);

/** A single SDUI component with optional children, actions, and conditions. */
export interface SduiComponent {
  id: string;
  type: SduiComponentType;
  props?: Record<string, unknown>;
  children?: SduiComponent[];
  action?: SduiAction;
  analytics?: SduiAnalyticsMetadata;
  conditions?: SduiCondition[];
  /** When set, the server expands this component once per array item. */
  repeat?: SduiRepeat;
}

// ---------------------------------------------------------------------------
// Overlay schema (depends on SduiComponent)
// ---------------------------------------------------------------------------

/**
 * Schema for a screen-level overlay. Overlays are defined separately from the
 * main component tree and triggered either manually via a `show_overlay` action
 * or automatically when the screen loads (`on_load` trigger).
 */
export const sduiOverlaySchema = z.object({
  /** Unique identifier for this overlay, referenced by `show_overlay` actions. */
  id: z.string(),
  /** Visual presentation style. Defaults to `"modal"`. */
  style: sduiOverlayStyleSchema.default("modal"),
  /** Whether the overlay can be dismissed by tapping outside or swiping. Defaults to `true`. */
  dismissible: z.boolean().default(true),
  /** When the overlay is presented. Defaults to `{ type: "manual" }`. */
  trigger: sduiOverlayTriggerSchema.default({ type: "manual" }),
  /** Auto-dismiss the overlay after this many milliseconds. */
  dismissAfterMs: z.number().positive().optional(),
  /** Component tree rendered inside the overlay container. */
  components: z.array(sduiComponentSchema),
});

/** A screen-level overlay definition. */
export type SduiOverlay = z.infer<typeof sduiOverlaySchema>;

// ---------------------------------------------------------------------------
// Screen schema -- the top-level response
// ---------------------------------------------------------------------------

/** Schema for a full SDUI screen returned by the service. */
export const sduiScreenSchema = z.object({
  schemaVersion: z.string(),
  screenId: z.string(),
  brand: z.string(),
  updatedAt: z.string(),
  components: z.array(sduiComponentSchema),
  metadata: z.record(z.string(), z.unknown()).optional(),
  /** Data sources the server resolves before returning the screen. */
  dataSources: z.array(sduiDataSourceSchema).optional(),
  /** Screen-level overlays (modals, bottom sheets, fullscreen). */
  overlays: z.array(sduiOverlaySchema).optional(),
});

/** A full server-driven screen definition. */
export type SduiScreen = z.infer<typeof sduiScreenSchema>;
