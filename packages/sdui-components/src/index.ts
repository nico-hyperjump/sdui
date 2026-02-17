// Prop helpers
export { propStr, propNum, propBool, propArr } from "./prop-helpers";

// Type-safe component map
export { mobileComponentMap } from "./component-map";

// Pre-built registry
export { mobileRegistry } from "./mobile-registry";

// Re-export the map type for convenience
export type { SduiComponentMap } from "@workspace/sdui-sdk";

// Individual components (for consumers who need direct access)

// Layout
export { SduiStack } from "./components/sdui-stack";
export { SduiRow } from "./components/sdui-row";
export { SduiColumn } from "./components/sdui-column";
export { SduiScrollView } from "./components/sdui-scroll-view";
export { SduiSpacer } from "./components/sdui-spacer";

// Content
export { SduiText } from "./components/sdui-text";
export { SduiImage } from "./components/sdui-image";
export { SduiIcon } from "./components/sdui-icon";
export { SduiDivider } from "./components/sdui-divider";

// Interactive
export { SduiButton } from "./components/sdui-button";
export { SduiCard } from "./components/sdui-card";
export { SduiLink } from "./components/sdui-link";

// Composite
export { SduiHeroBanner } from "./components/sdui-hero-banner";
export { SduiActionCard } from "./components/sdui-action-card";
export { SduiProductCard } from "./components/sdui-product-card";
export { SduiListItem } from "./components/sdui-list-item";
export { SduiActionGrid } from "./components/sdui-action-grid";
export { SduiWebView } from "./components/sdui-web-view";

// Phase 1 — Foundation
export { SduiCarousel } from "./components/sdui-carousel";
export { SduiSectionHeader } from "./components/sdui-section-header";
export { SduiChip } from "./components/sdui-chip";
export { SduiAvatar } from "./components/sdui-avatar";
export { SduiSearchBar } from "./components/sdui-search-bar";
export { SduiProgressBar } from "./components/sdui-progress-bar";
export { SduiRating } from "./components/sdui-rating";
export { SduiTextInput } from "./components/sdui-text-input";
export { SduiToggle } from "./components/sdui-toggle";
export { SduiDropdown } from "./components/sdui-dropdown";

// Phase 2 — Engagement
export { SduiStoryCircle } from "./components/sdui-story-circle";
export { SduiVideoPlayer } from "./components/sdui-video-player";
export { SduiCountdownTimer } from "./components/sdui-countdown-timer";
export { SduiTabBar } from "./components/sdui-tab-bar";
export { SduiBanner } from "./components/sdui-banner";
export { SduiEmptyState } from "./components/sdui-empty-state";
export { SduiBottomSheet } from "./components/sdui-bottom-sheet";
export { SduiAccordion } from "./components/sdui-accordion";

// Phase 3 — Forms & Advanced
export { SduiStepper } from "./components/sdui-stepper";
export { SduiCheckbox } from "./components/sdui-checkbox";
export { SduiRadioGroup } from "./components/sdui-radio-group";
export { SduiSlider } from "./components/sdui-slider";
export { SduiDatePicker } from "./components/sdui-date-picker";
export { SduiSwipeableRow } from "./components/sdui-swipeable-row";
export { SduiFloatingActionButton } from "./components/sdui-floating-action-button";
export { SduiPullToRefresh } from "./components/sdui-pull-to-refresh";

// Phase 4 — Specialized
export { SduiMapView } from "./components/sdui-map-view";
export { SduiChart } from "./components/sdui-chart";
export { SduiLottieAnimation } from "./components/sdui-lottie-animation";
export { SduiQrCode } from "./components/sdui-qr-code";
export { SduiMediaGallery } from "./components/sdui-media-gallery";
export { SduiStepIndicator } from "./components/sdui-step-indicator";
export { SduiComparisonTable } from "./components/sdui-comparison-table";
export { SduiSkeletonLoader } from "./components/sdui-skeleton-loader";
export { SduiSocialProof } from "./components/sdui-social-proof";

// Overlay
export { SduiOverlayContainer } from "./components/sdui-overlay-container";
