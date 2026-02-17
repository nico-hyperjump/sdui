import { StyleSheet } from "react-native";

/**
 * Shared stylesheet for all SDUI mobile component implementations.
 * Extracted so individual component files can import only what they need.
 */
export const styles = StyleSheet.create({
  // --- Layout ---
  stack: { flexDirection: "column" },
  row: { flexDirection: "row", alignItems: "center" },
  column: { flexDirection: "column" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },

  // --- Content ---
  text: { fontSize: 16 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  iconPlaceholder: { textAlign: "center" },
  divider: { width: "100%", marginVertical: 8 },

  // --- Interactive ---
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  card: { padding: 16, borderRadius: 12, marginVertical: 4 },
  link: { fontSize: 16, textDecorationLine: "underline" },

  // --- Composite (existing) ---
  heroBanner: { borderRadius: 12, overflow: "hidden", marginVertical: 8 },
  heroImage: { width: "100%", height: 180 },
  heroText: { padding: 16 },
  heroTitle: { fontSize: 22, fontWeight: "600", marginBottom: 4 },
  heroSubtitle: { fontSize: 16, opacity: 0.9 },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  productCard: { borderRadius: 12, overflow: "hidden", marginVertical: 4 },
  productImage: { width: "100%", height: 140 },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 12,
    paddingBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  listItem: { paddingVertical: 12, borderBottomWidth: 1 },
  listItemTitle: { fontSize: 16, fontWeight: "500" },
  listItemSubtitle: { fontSize: 14, opacity: 0.8, marginTop: 2 },
  webViewPlaceholder: {
    minHeight: 120,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
  },

  // --- Phase 1: Carousel ---
  carousel: { overflow: "hidden", marginVertical: 8 },
  carouselIndicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  carouselDot: { width: 8, height: 8, borderRadius: 4 },

  // --- Phase 1: Section Header ---
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  sectionSubtitle: { fontSize: 14, opacity: 0.7, marginTop: 2 },
  sectionAction: { fontSize: 14, fontWeight: "500" },

  // --- Phase 1: Chip ---
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  chipLabel: { fontSize: 14, fontWeight: "500" },

  // --- Phase 1: Avatar ---
  avatar: {
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarInitials: { fontWeight: "600" },

  // --- Phase 1: Search Bar ---
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchBarIcon: { fontSize: 16, marginRight: 8, opacity: 0.5 },
  searchBarPlaceholder: { fontSize: 16, opacity: 0.5 },

  // --- Phase 1: Progress Bar ---
  progressBarContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  progressBarTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressBarLabel: { fontSize: 12, marginTop: 4, textAlign: "right" },
  progressCircleContainer: { alignItems: "center", justifyContent: "center" },
  progressCircleText: { fontSize: 14, fontWeight: "600" },

  // --- Phase 1: Rating ---
  ratingContainer: { flexDirection: "row", gap: 4 },
  ratingStar: { fontSize: 20 },

  // --- Phase 1: Text Input ---
  textInputContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  textInputLabel: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  textInputField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },

  // --- Phase 1: Toggle ---
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleLabel: { fontSize: 16, flex: 1 },

  // --- Phase 1: Dropdown ---
  dropdownContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  dropdownLabel: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownButtonText: { fontSize: 16 },
  dropdownArrow: { fontSize: 12, opacity: 0.5 },
  dropdownMenu: { borderWidth: 1, borderRadius: 8, marginTop: 4 },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownOptionText: { fontSize: 16 },

  // --- Phase 2: Story Circle ---
  storyCircle: { alignItems: "center", width: 72 },
  storyCircleRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  storyCircleImage: { width: 56, height: 56, borderRadius: 28 },
  storyCircleLabel: { fontSize: 12, marginTop: 4, textAlign: "center" },

  // --- Phase 2: Video Player ---
  videoPlayer: {
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPoster: { width: "100%", height: 200 },
  videoOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayButton: { fontSize: 48, color: "#ffffff" },

  // --- Phase 2: Countdown Timer ---
  countdownContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  countdownLabel: { fontSize: 14, fontWeight: "500", marginRight: 8 },
  countdownSegment: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: "center",
    minWidth: 36,
  },
  countdownValue: { fontSize: 18, fontWeight: "700", color: "#ffffff" },
  countdownUnit: { fontSize: 10, color: "#ffffff", opacity: 0.8 },
  countdownSeparator: { fontSize: 18, fontWeight: "700" },

  // --- Phase 2: Tab Bar ---
  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabLabel: { fontSize: 14, fontWeight: "500" },
  tabIndicator: { height: 2, marginTop: 4, borderRadius: 1, width: "100%" },

  // --- Phase 2: Banner ---
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bannerMessage: { fontSize: 14, flex: 1 },
  bannerDismiss: { fontSize: 18, fontWeight: "600", marginLeft: 12 },

  // --- Phase 2: Empty State ---
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateImage: { width: 120, height: 120, marginBottom: 16 },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 16,
  },

  // --- Phase 2: Bottom Sheet ---
  bottomSheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheetContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: 200,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
    opacity: 0.3,
  },

  // --- Phase 2: Accordion ---
  accordionContainer: { overflow: "hidden" },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accordionTitle: { fontSize: 16, fontWeight: "500", flex: 1 },
  accordionArrow: { fontSize: 16 },
  accordionBody: { paddingHorizontal: 16, paddingBottom: 14 },

  // --- Phase 3: Stepper ---
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonText: { fontSize: 20, fontWeight: "600", color: "#ffffff" },
  stepperValue: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "center",
  },

  // --- Phase 3: Checkbox ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxCheck: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  checkboxLabel: { fontSize: 16 },

  // --- Phase 3: Radio Group ---
  radioGroupContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  radioLabel: { fontSize: 16 },

  // --- Phase 3: Slider ---
  sliderContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  sliderLabel: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  sliderTrack: { height: 4, borderRadius: 2, position: "relative" },
  sliderFill: { height: "100%", borderRadius: 2 },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: -10,
  },
  sliderValue: { fontSize: 12, textAlign: "right", marginTop: 4 },

  // --- Phase 3: Date Picker ---
  datePickerContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  datePickerLabel: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  datePickerText: { fontSize: 16 },
  datePickerIcon: { fontSize: 16, opacity: 0.5 },

  // --- Phase 3: Swipeable Row ---
  swipeableRow: { flexDirection: "row", overflow: "hidden" },
  swipeableContent: { flex: 1 },
  swipeableActions: { flexDirection: "row" },
  swipeableActionButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  swipeableActionText: { color: "#ffffff", fontSize: 14, fontWeight: "500" },

  // --- Phase 3: FAB ---
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: { fontSize: 24, color: "#ffffff" },
  fabLabel: { fontSize: 12, color: "#ffffff", marginTop: 2 },

  // --- Phase 3: Pull to Refresh ---
  pullToRefresh: { flex: 1 },

  // --- Phase 4: Map View ---
  mapView: {
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: { fontSize: 14, opacity: 0.6 },

  // --- Phase 4: Chart ---
  chartContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  chartBarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 120,
  },
  chartBar: { flex: 1, borderRadius: 4, minWidth: 20 },
  chartBarLabel: { fontSize: 10, textAlign: "center", marginTop: 4 },

  // --- Phase 4: Lottie Animation ---
  lottieContainer: { alignItems: "center", justifyContent: "center" },
  lottiePlaceholder: { fontSize: 14, opacity: 0.6 },

  // --- Phase 4: QR Code ---
  qrCodeContainer: { alignItems: "center", paddingVertical: 16 },
  qrCodePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
  },
  qrCodeText: { fontSize: 12, marginTop: 8, opacity: 0.6 },

  // --- Phase 4: Media Gallery ---
  mediaGallery: { marginVertical: 8 },
  mediaGalleryItem: { borderRadius: 8, overflow: "hidden", marginRight: 8 },

  // --- Phase 4: Step Indicator ---
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stepIndicatorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndicatorNumber: { fontSize: 12, fontWeight: "600", color: "#ffffff" },
  stepIndicatorLine: { flex: 1, height: 2, marginHorizontal: 4 },
  stepIndicatorLabel: { fontSize: 10, textAlign: "center", marginTop: 4 },

  // --- Phase 4: Comparison Table ---
  comparisonTable: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  comparisonHeaderRow: { flexDirection: "row" },
  comparisonHeaderCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  comparisonHeaderText: { fontSize: 14, fontWeight: "600" },
  comparisonRow: { flexDirection: "row", borderTopWidth: 1 },
  comparisonCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  comparisonCellText: { fontSize: 14 },

  // --- Phase 4: Skeleton Loader ---
  skeletonContainer: { overflow: "hidden" },
  skeletonLine: { height: 14, borderRadius: 4, marginVertical: 4 },
  skeletonImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginVertical: 4,
  },
  skeletonCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    height: 120,
  },

  // --- Phase 4: Social Proof ---
  socialProof: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  socialProofIcon: { fontSize: 14 },
  socialProofText: { fontSize: 13, opacity: 0.8 },

  // --- Overlay Container ---
  overlayBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayModalCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayModalCard: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  overlayFullscreen: {
    flex: 1,
  },
});
