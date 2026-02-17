import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiOverlayContainer } from "./sdui-overlay-container";

describe("SduiOverlayContainer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when visible is false", () => {
    // Act
    const result = SduiOverlayContainer({
      style: "modal",
      dismissible: true,
      visible: false,
      onDismiss: vi.fn(),
      children: "Content",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("renders a modal overlay when visible and style is modal", () => {
    // Act
    const result = SduiOverlayContainer({
      style: "modal",
      dismissible: true,
      visible: true,
      onDismiss: vi.fn(),
      children: "Modal content",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders a bottom_sheet overlay when visible", () => {
    // Act
    const result = SduiOverlayContainer({
      style: "bottom_sheet",
      dismissible: true,
      visible: true,
      onDismiss: vi.fn(),
      children: "Sheet content",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders a fullscreen overlay when visible", () => {
    // Act
    const result = SduiOverlayContainer({
      style: "fullscreen",
      dismissible: false,
      visible: true,
      onDismiss: vi.fn(),
      children: "Fullscreen content",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders non-dismissible modal overlay", () => {
    // Act
    const result = SduiOverlayContainer({
      style: "modal",
      dismissible: false,
      visible: true,
      onDismiss: vi.fn(),
      children: "Locked modal",
    });

    // Assert
    expect(result).not.toBeNull();
  });
});
