import type { SduiComponentMap } from "@workspace/sdui-sdk";
import { SduiStack } from "./components/sdui-stack";
import { SduiRow } from "./components/sdui-row";
import { SduiColumn } from "./components/sdui-column";
import { SduiScrollView } from "./components/sdui-scroll-view";
import { SduiSpacer } from "./components/sdui-spacer";
import { SduiText } from "./components/sdui-text";
import { SduiImage } from "./components/sdui-image";
import { SduiIcon } from "./components/sdui-icon";
import { SduiDivider } from "./components/sdui-divider";
import { SduiButton } from "./components/sdui-button";
import { SduiCard } from "./components/sdui-card";
import { SduiLink } from "./components/sdui-link";
import { SduiHeroBanner } from "./components/sdui-hero-banner";
import { SduiActionCard } from "./components/sdui-action-card";
import { SduiProductCard } from "./components/sdui-product-card";
import { SduiListItem } from "./components/sdui-list-item";
import { SduiActionGrid } from "./components/sdui-action-grid";
import { SduiWebView } from "./components/sdui-web-view";
// Phase 1
import { SduiCarousel } from "./components/sdui-carousel";
import { SduiSectionHeader } from "./components/sdui-section-header";
import { SduiChip } from "./components/sdui-chip";
import { SduiAvatar } from "./components/sdui-avatar";
import { SduiSearchBar } from "./components/sdui-search-bar";
import { SduiProgressBar } from "./components/sdui-progress-bar";
import { SduiRating } from "./components/sdui-rating";
import { SduiTextInput } from "./components/sdui-text-input";
import { SduiToggle } from "./components/sdui-toggle";
import { SduiDropdown } from "./components/sdui-dropdown";
// Phase 2
import { SduiStoryCircle } from "./components/sdui-story-circle";
import { SduiVideoPlayer } from "./components/sdui-video-player";
import { SduiCountdownTimer } from "./components/sdui-countdown-timer";
import { SduiTabBar } from "./components/sdui-tab-bar";
import { SduiBanner } from "./components/sdui-banner";
import { SduiEmptyState } from "./components/sdui-empty-state";
import { SduiBottomSheet } from "./components/sdui-bottom-sheet";
import { SduiAccordion } from "./components/sdui-accordion";
// Phase 3
import { SduiStepper } from "./components/sdui-stepper";
import { SduiCheckbox } from "./components/sdui-checkbox";
import { SduiRadioGroup } from "./components/sdui-radio-group";
import { SduiSlider } from "./components/sdui-slider";
import { SduiDatePicker } from "./components/sdui-date-picker";
import { SduiSwipeableRow } from "./components/sdui-swipeable-row";
import { SduiFloatingActionButton } from "./components/sdui-floating-action-button";
import { SduiPullToRefresh } from "./components/sdui-pull-to-refresh";
// Phase 4
import { SduiMapView } from "./components/sdui-map-view";
import { SduiChart } from "./components/sdui-chart";
import { SduiLottieAnimation } from "./components/sdui-lottie-animation";
import { SduiQrCode } from "./components/sdui-qr-code";
import { SduiMediaGallery } from "./components/sdui-media-gallery";
import { SduiStepIndicator } from "./components/sdui-step-indicator";
import { SduiComparisonTable } from "./components/sdui-comparison-table";
import { SduiSkeletonLoader } from "./components/sdui-skeleton-loader";
import { SduiSocialProof } from "./components/sdui-social-proof";

/**
 * Type-safe mapping from every SDUI component type to its React Native implementation.
 * Because this is typed as `SduiComponentMap` (a `Record<SduiComponentType, ...>`),
 * TypeScript will error at compile time if any component type is missing or misspelled.
 */
export const mobileComponentMap: SduiComponentMap = {
  // Layout
  stack: SduiStack,
  row: SduiRow,
  column: SduiColumn,
  scroll_view: SduiScrollView,
  spacer: SduiSpacer,
  // Content
  text: SduiText,
  image: SduiImage,
  icon: SduiIcon,
  divider: SduiDivider,
  // Interactive
  button: SduiButton,
  card: SduiCard,
  link: SduiLink,
  // Composite
  hero_banner: SduiHeroBanner,
  action_card: SduiActionCard,
  product_card: SduiProductCard,
  list_item: SduiListItem,
  action_grid: SduiActionGrid,
  web_view: SduiWebView,
  // Phase 1 — Foundation
  carousel: SduiCarousel,
  section_header: SduiSectionHeader,
  chip: SduiChip,
  avatar: SduiAvatar,
  search_bar: SduiSearchBar,
  progress_bar: SduiProgressBar,
  rating: SduiRating,
  text_input: SduiTextInput,
  toggle: SduiToggle,
  dropdown: SduiDropdown,
  // Phase 2 — Engagement
  story_circle: SduiStoryCircle,
  video_player: SduiVideoPlayer,
  countdown_timer: SduiCountdownTimer,
  tab_bar: SduiTabBar,
  banner: SduiBanner,
  empty_state: SduiEmptyState,
  bottom_sheet: SduiBottomSheet,
  accordion: SduiAccordion,
  // Phase 3 — Forms & Advanced
  stepper: SduiStepper,
  checkbox: SduiCheckbox,
  radio_group: SduiRadioGroup,
  slider: SduiSlider,
  date_picker: SduiDatePicker,
  swipeable_row: SduiSwipeableRow,
  floating_action_button: SduiFloatingActionButton,
  pull_to_refresh: SduiPullToRefresh,
  // Phase 4 — Specialized
  map_view: SduiMapView,
  chart: SduiChart,
  lottie_animation: SduiLottieAnimation,
  qr_code: SduiQrCode,
  media_gallery: SduiMediaGallery,
  step_indicator: SduiStepIndicator,
  comparison_table: SduiComparisonTable,
  skeleton_loader: SduiSkeletonLoader,
  social_proof: SduiSocialProof,
};
