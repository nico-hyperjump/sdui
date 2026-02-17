import {
  Layers,
  Rows3,
  Columns3,
  ScrollText,
  Space,
  Type,
  ImageIcon,
  Smile,
  Minus,
  MousePointerClick,
  SquareStack,
  Link2,
  Star,
  CreditCard,
  Package,
  List,
  LayoutGrid,
  Globe,
  GalleryHorizontalEnd,
  Heading,
  Tag,
  CircleUser,
  Search,
  Loader,
  StarHalf,
  TextCursorInput,
  ToggleRight,
  ChevronDown,
  CircleDot,
  Play,
  Timer,
  PanelTop,
  Flag,
  Ban,
  PanelBottomClose,
  ChevronRight,
  Hash,
  CheckSquare,
  CircleCheck,
  SlidersHorizontal,
  CalendarDays,
  ArrowRightLeft,
  Plus,
  RefreshCw,
  MapPin,
  BarChart3,
  Sparkles,
  QrCode,
  Images,
  ListOrdered,
  Table2,
  Bone,
  Users,
} from "lucide-react";
import type { SduiComponentType } from "@workspace/sdui-schema";
import type { ComponentMeta } from "./types";

/**
 * Static metadata registry mapping every SDUI component type to its display
 * info, category, accepted children, and editable property definitions.
 *
 * This registry drives:
 * - **Component palette** grouping and labelling
 * - **Tree node** icon rendering
 * - **Property panel** dynamic form generation
 */
export const COMPONENT_REGISTRY: Record<SduiComponentType, ComponentMeta> = {
  // ---------------------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------------------
  stack: {
    label: "Stack",
    category: "Layout",
    icon: Layers,
    acceptsChildren: true,
    propFields: [
      { name: "gap", label: "Gap", type: "number", defaultValue: 8 },
    ],
  },
  row: {
    label: "Row",
    category: "Layout",
    icon: Rows3,
    acceptsChildren: true,
    propFields: [
      { name: "gap", label: "Gap", type: "number", defaultValue: 8 },
    ],
  },
  column: {
    label: "Column",
    category: "Layout",
    icon: Columns3,
    acceptsChildren: true,
    propFields: [
      { name: "gap", label: "Gap", type: "number", defaultValue: 8 },
    ],
  },
  scroll_view: {
    label: "Scroll View",
    category: "Layout",
    icon: ScrollText,
    acceptsChildren: true,
    propFields: [],
  },
  spacer: {
    label: "Spacer",
    category: "Layout",
    icon: Space,
    acceptsChildren: false,
    propFields: [
      { name: "height", label: "Height", type: "number", defaultValue: 16 },
    ],
  },

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------
  text: {
    label: "Text",
    category: "Content",
    icon: Type,
    acceptsChildren: false,
    propFields: [
      { name: "content", label: "Content", type: "string", required: true },
      {
        name: "variant",
        label: "Variant",
        type: "select",
        defaultValue: "body",
        options: [
          { label: "Body", value: "body" },
          { label: "Heading", value: "heading" },
          { label: "Title", value: "title" },
        ],
      },
    ],
  },
  image: {
    label: "Image",
    category: "Content",
    icon: ImageIcon,
    acceptsChildren: false,
    propFields: [
      { name: "uri", label: "Image URL", type: "url", required: true },
      { name: "width", label: "Width", type: "number" },
      { name: "height", label: "Height", type: "number" },
    ],
  },
  icon: {
    label: "Icon",
    category: "Content",
    icon: Smile,
    acceptsChildren: false,
    propFields: [
      { name: "name", label: "Name", type: "string", required: true },
      { name: "size", label: "Size", type: "number", defaultValue: 24 },
    ],
  },
  divider: {
    label: "Divider",
    category: "Content",
    icon: Minus,
    acceptsChildren: false,
    propFields: [
      {
        name: "thickness",
        label: "Thickness",
        type: "number",
        defaultValue: 1,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Interactive
  // ---------------------------------------------------------------------------
  button: {
    label: "Button",
    category: "Interactive",
    icon: MousePointerClick,
    acceptsChildren: true,
    propFields: [
      {
        name: "label",
        label: "Label",
        type: "string",
        defaultValue: "Button",
      },
    ],
  },
  card: {
    label: "Card",
    category: "Interactive",
    icon: SquareStack,
    acceptsChildren: true,
    propFields: [],
  },
  link: {
    label: "Link",
    category: "Interactive",
    icon: Link2,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string", defaultValue: "Link" },
      { name: "href", label: "URL", type: "url" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Composite
  // ---------------------------------------------------------------------------
  hero_banner: {
    label: "Hero Banner",
    category: "Composite",
    icon: Star,
    acceptsChildren: true,
    propFields: [
      { name: "title", label: "Title", type: "string" },
      { name: "subtitle", label: "Subtitle", type: "string" },
      { name: "imageUri", label: "Image URL", type: "url" },
    ],
  },
  action_card: {
    label: "Action Card",
    category: "Composite",
    icon: CreditCard,
    acceptsChildren: true,
    propFields: [{ name: "title", label: "Title", type: "string" }],
  },
  product_card: {
    label: "Product Card",
    category: "Composite",
    icon: Package,
    acceptsChildren: false,
    propFields: [
      { name: "title", label: "Title", type: "string" },
      { name: "price", label: "Price", type: "string" },
      { name: "imageUri", label: "Image URL", type: "url" },
      { name: "badge", label: "Badge", type: "string" },
    ],
  },
  list_item: {
    label: "List Item",
    category: "Composite",
    icon: List,
    acceptsChildren: false,
    propFields: [
      { name: "title", label: "Title", type: "string" },
      { name: "subtitle", label: "Subtitle", type: "string" },
    ],
  },
  action_grid: {
    label: "Action Grid",
    category: "Composite",
    icon: LayoutGrid,
    acceptsChildren: true,
    propFields: [],
  },
  web_view: {
    label: "Web View",
    category: "Composite",
    icon: Globe,
    acceptsChildren: false,
    propFields: [{ name: "url", label: "URL", type: "url", required: true }],
  },

  // ---------------------------------------------------------------------------
  // Foundation (Phase 1)
  // ---------------------------------------------------------------------------
  carousel: {
    label: "Carousel",
    category: "Foundation",
    icon: GalleryHorizontalEnd,
    acceptsChildren: true,
    propFields: [
      { name: "autoPlay", label: "Auto Play", type: "boolean" },
      {
        name: "interval",
        label: "Interval (ms)",
        type: "number",
        defaultValue: 3000,
      },
      {
        name: "showIndicators",
        label: "Show Indicators",
        type: "boolean",
        defaultValue: true,
      },
      { name: "loop", label: "Loop", type: "boolean" },
    ],
  },
  section_header: {
    label: "Section Header",
    category: "Foundation",
    icon: Heading,
    acceptsChildren: false,
    propFields: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "subtitle", label: "Subtitle", type: "string" },
      {
        name: "actionLabel",
        label: "Action Label",
        type: "string",
        defaultValue: "See All",
      },
    ],
  },
  chip: {
    label: "Chip",
    category: "Foundation",
    icon: Tag,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string", required: true },
      {
        name: "variant",
        label: "Variant",
        type: "select",
        defaultValue: "filled",
        options: [
          { label: "Filled", value: "filled" },
          { label: "Outlined", value: "outlined" },
        ],
      },
      { name: "selected", label: "Selected", type: "boolean" },
    ],
  },
  avatar: {
    label: "Avatar",
    category: "Foundation",
    icon: CircleUser,
    acceptsChildren: false,
    propFields: [
      { name: "uri", label: "Image URL", type: "url" },
      { name: "size", label: "Size", type: "number", defaultValue: 48 },
      {
        name: "fallbackInitials",
        label: "Fallback Initials",
        type: "string",
      },
    ],
  },
  search_bar: {
    label: "Search Bar",
    category: "Foundation",
    icon: Search,
    acceptsChildren: false,
    propFields: [
      {
        name: "placeholder",
        label: "Placeholder",
        type: "string",
        defaultValue: "Search...",
      },
    ],
  },
  progress_bar: {
    label: "Progress Bar",
    category: "Foundation",
    icon: Loader,
    acceptsChildren: false,
    propFields: [
      { name: "value", label: "Value", type: "number" },
      {
        name: "variant",
        label: "Variant",
        type: "select",
        defaultValue: "bar",
        options: [
          { label: "Bar", value: "bar" },
          { label: "Circle", value: "circle" },
        ],
      },
      { name: "label", label: "Label", type: "string" },
    ],
  },
  rating: {
    label: "Rating",
    category: "Foundation",
    icon: StarHalf,
    acceptsChildren: false,
    propFields: [
      { name: "value", label: "Value", type: "number" },
      { name: "maxStars", label: "Max Stars", type: "number", defaultValue: 5 },
      { name: "size", label: "Size", type: "number", defaultValue: 20 },
      { name: "interactive", label: "Interactive", type: "boolean" },
    ],
  },
  text_input: {
    label: "Text Input",
    category: "Foundation",
    icon: TextCursorInput,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string" },
      { name: "placeholder", label: "Placeholder", type: "string" },
      {
        name: "inputType",
        label: "Input Type",
        type: "select",
        defaultValue: "text",
        options: [
          { label: "Text", value: "text" },
          { label: "Email", value: "email" },
          { label: "Password", value: "password" },
          { label: "Number", value: "number" },
        ],
      },
    ],
  },
  toggle: {
    label: "Toggle",
    category: "Foundation",
    icon: ToggleRight,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string" },
      { name: "value", label: "Value", type: "boolean" },
    ],
  },
  dropdown: {
    label: "Dropdown",
    category: "Foundation",
    icon: ChevronDown,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string" },
      { name: "selectedValue", label: "Selected Value", type: "string" },
      { name: "options", label: "Options", type: "json", defaultValue: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // Engagement (Phase 2)
  // ---------------------------------------------------------------------------
  story_circle: {
    label: "Story Circle",
    category: "Engagement",
    icon: CircleDot,
    acceptsChildren: false,
    propFields: [
      { name: "imageUri", label: "Image URL", type: "url" },
      { name: "label", label: "Label", type: "string" },
      { name: "seen", label: "Seen", type: "boolean" },
    ],
  },
  video_player: {
    label: "Video Player",
    category: "Engagement",
    icon: Play,
    acceptsChildren: false,
    propFields: [
      { name: "uri", label: "Video URL", type: "url", required: true },
      { name: "poster", label: "Poster URL", type: "url" },
      {
        name: "aspectRatio",
        label: "Aspect Ratio",
        type: "number",
        defaultValue: 1.78,
      },
    ],
  },
  countdown_timer: {
    label: "Countdown Timer",
    category: "Engagement",
    icon: Timer,
    acceptsChildren: false,
    propFields: [
      {
        name: "endTime",
        label: "End Time (ISO)",
        type: "string",
        required: true,
      },
      { name: "label", label: "Label", type: "string" },
    ],
  },
  tab_bar: {
    label: "Tab Bar",
    category: "Engagement",
    icon: PanelTop,
    acceptsChildren: true,
    propFields: [
      { name: "tabs", label: "Tabs", type: "json", defaultValue: [] },
      { name: "selectedIndex", label: "Selected Index", type: "number" },
    ],
  },
  banner: {
    label: "Banner",
    category: "Engagement",
    icon: Flag,
    acceptsChildren: false,
    propFields: [
      { name: "message", label: "Message", type: "string", required: true },
      {
        name: "variant",
        label: "Variant",
        type: "select",
        defaultValue: "info",
        options: [
          { label: "Info", value: "info" },
          { label: "Warning", value: "warning" },
          { label: "Error", value: "error" },
          { label: "Success", value: "success" },
        ],
      },
      {
        name: "dismissible",
        label: "Dismissible",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },
  empty_state: {
    label: "Empty State",
    category: "Engagement",
    icon: Ban,
    acceptsChildren: false,
    propFields: [
      { name: "imageUri", label: "Image URL", type: "url" },
      { name: "title", label: "Title", type: "string" },
      { name: "subtitle", label: "Subtitle", type: "string" },
      {
        name: "actionLabel",
        label: "Action Label",
        type: "string",
        defaultValue: "Try Again",
      },
    ],
  },
  bottom_sheet: {
    label: "Bottom Sheet",
    category: "Engagement",
    icon: PanelBottomClose,
    acceptsChildren: true,
    propFields: [
      {
        name: "dismissible",
        label: "Dismissible",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },
  accordion: {
    label: "Accordion",
    category: "Engagement",
    icon: ChevronRight,
    acceptsChildren: true,
    propFields: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "expanded", label: "Expanded", type: "boolean" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Forms & Advanced (Phase 3)
  // ---------------------------------------------------------------------------
  stepper: {
    label: "Stepper",
    category: "Forms",
    icon: Hash,
    acceptsChildren: false,
    propFields: [
      { name: "value", label: "Value", type: "number", defaultValue: 1 },
      { name: "min", label: "Min", type: "number", defaultValue: 0 },
      { name: "max", label: "Max", type: "number", defaultValue: 99 },
      { name: "step", label: "Step", type: "number", defaultValue: 1 },
    ],
  },
  checkbox: {
    label: "Checkbox",
    category: "Forms",
    icon: CheckSquare,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string" },
      { name: "value", label: "Checked", type: "boolean" },
    ],
  },
  radio_group: {
    label: "Radio Group",
    category: "Forms",
    icon: CircleCheck,
    acceptsChildren: false,
    propFields: [
      { name: "options", label: "Options", type: "json", defaultValue: [] },
      { name: "value", label: "Value", type: "string" },
    ],
  },
  slider: {
    label: "Slider",
    category: "Forms",
    icon: SlidersHorizontal,
    acceptsChildren: false,
    propFields: [
      { name: "min", label: "Min", type: "number", defaultValue: 0 },
      { name: "max", label: "Max", type: "number", defaultValue: 100 },
      { name: "value", label: "Value", type: "number" },
      { name: "label", label: "Label", type: "string" },
    ],
  },
  date_picker: {
    label: "Date Picker",
    category: "Forms",
    icon: CalendarDays,
    acceptsChildren: false,
    propFields: [
      { name: "label", label: "Label", type: "string" },
      { name: "value", label: "Value", type: "string" },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        defaultValue: "date",
        options: [
          { label: "Date", value: "date" },
          { label: "Time", value: "time" },
          { label: "Date & Time", value: "datetime" },
        ],
      },
    ],
  },
  swipeable_row: {
    label: "Swipeable Row",
    category: "Forms",
    icon: ArrowRightLeft,
    acceptsChildren: true,
    propFields: [
      {
        name: "rightActions",
        label: "Right Actions",
        type: "json",
        defaultValue: [],
      },
    ],
  },
  floating_action_button: {
    label: "FAB",
    category: "Forms",
    icon: Plus,
    acceptsChildren: false,
    propFields: [
      { name: "icon", label: "Icon", type: "string", defaultValue: "+" },
      { name: "label", label: "Label", type: "string" },
      {
        name: "position",
        label: "Position",
        type: "select",
        defaultValue: "bottom-right",
        options: [
          { label: "Bottom Right", value: "bottom-right" },
          { label: "Bottom Left", value: "bottom-left" },
          { label: "Bottom Center", value: "bottom-center" },
        ],
      },
    ],
  },
  pull_to_refresh: {
    label: "Pull to Refresh",
    category: "Forms",
    icon: RefreshCw,
    acceptsChildren: true,
    propFields: [],
  },

  // ---------------------------------------------------------------------------
  // Specialized (Phase 4)
  // ---------------------------------------------------------------------------
  map_view: {
    label: "Map View",
    category: "Specialized",
    icon: MapPin,
    acceptsChildren: false,
    propFields: [
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
      {
        name: "style",
        label: "Style",
        type: "select",
        defaultValue: "standard",
        options: [
          { label: "Standard", value: "standard" },
          { label: "Satellite", value: "satellite" },
          { label: "Hybrid", value: "hybrid" },
        ],
      },
    ],
  },
  chart: {
    label: "Chart",
    category: "Specialized",
    icon: BarChart3,
    acceptsChildren: false,
    propFields: [
      {
        name: "type",
        label: "Chart Type",
        type: "select",
        defaultValue: "bar",
        options: [
          { label: "Bar", value: "bar" },
          { label: "Line", value: "line" },
          { label: "Pie", value: "pie" },
        ],
      },
      { name: "data", label: "Data", type: "json", defaultValue: [] },
      { name: "labels", label: "Labels", type: "json", defaultValue: [] },
      { name: "height", label: "Height", type: "number", defaultValue: 120 },
    ],
  },
  lottie_animation: {
    label: "Lottie Animation",
    category: "Specialized",
    icon: Sparkles,
    acceptsChildren: false,
    propFields: [
      { name: "source", label: "Source URL", type: "url", required: true },
      { name: "width", label: "Width", type: "number", defaultValue: 120 },
      { name: "height", label: "Height", type: "number", defaultValue: 120 },
      { name: "autoPlay", label: "Auto Play", type: "boolean" },
      { name: "loop", label: "Loop", type: "boolean" },
    ],
  },
  qr_code: {
    label: "QR Code",
    category: "Specialized",
    icon: QrCode,
    acceptsChildren: false,
    propFields: [
      { name: "value", label: "Value", type: "string", required: true },
      { name: "size", label: "Size", type: "number", defaultValue: 160 },
    ],
  },
  media_gallery: {
    label: "Media Gallery",
    category: "Specialized",
    icon: Images,
    acceptsChildren: false,
    propFields: [
      { name: "items", label: "Items", type: "json", defaultValue: [] },
      { name: "height", label: "Height", type: "number", defaultValue: 200 },
    ],
  },
  step_indicator: {
    label: "Step Indicator",
    category: "Specialized",
    icon: ListOrdered,
    acceptsChildren: false,
    propFields: [
      { name: "steps", label: "Steps", type: "json", defaultValue: [] },
      { name: "currentStep", label: "Current Step", type: "number" },
    ],
  },
  comparison_table: {
    label: "Comparison Table",
    category: "Specialized",
    icon: Table2,
    acceptsChildren: false,
    propFields: [
      { name: "columns", label: "Columns", type: "json", defaultValue: [] },
      { name: "rows", label: "Rows", type: "json", defaultValue: [] },
      {
        name: "highlightedColumn",
        label: "Highlighted Column",
        type: "number",
      },
    ],
  },
  skeleton_loader: {
    label: "Skeleton Loader",
    category: "Specialized",
    icon: Bone,
    acceptsChildren: false,
    propFields: [
      {
        name: "variant",
        label: "Variant",
        type: "select",
        defaultValue: "text",
        options: [
          { label: "Text", value: "text" },
          { label: "Circle", value: "circle" },
          { label: "Rect", value: "rect" },
        ],
      },
      { name: "lines", label: "Lines", type: "number", defaultValue: 3 },
    ],
  },
  social_proof: {
    label: "Social Proof",
    category: "Specialized",
    icon: Users,
    acceptsChildren: false,
    propFields: [
      { name: "text", label: "Text", type: "string" },
      { name: "icon", label: "Icon", type: "string", defaultValue: "🔥" },
      { name: "count", label: "Count", type: "number" },
    ],
  },
};

/** Ordered list of palette categories for consistent rendering. */
export const PALETTE_CATEGORIES = [
  "Layout",
  "Content",
  "Interactive",
  "Composite",
  "Foundation",
  "Engagement",
  "Forms",
  "Specialized",
] as const;

/**
 * Returns the `ComponentMeta` for a given SDUI component type.
 * @param type - The SDUI component type string.
 * @returns The metadata object, or `undefined` if the type is not registered.
 */
export function getComponentMeta(
  type: SduiComponentType,
): ComponentMeta | undefined {
  return COMPONENT_REGISTRY[type];
}
