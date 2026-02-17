import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { SduiOverlay } from "@workspace/sdui-schema";
import { OverlayPanel } from "./overlay-panel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Factory for creating a test overlay with sensible defaults.
 * @param overrides - Partial overlay fields to merge.
 * @returns A complete `SduiOverlay`.
 */
function makeOverlay(overrides: Partial<SduiOverlay> = {}): SduiOverlay {
  return {
    id: "test_overlay",
    style: "modal",
    dismissible: true,
    trigger: { type: "manual" },
    components: [],
    ...overrides,
  };
}

describe("OverlayPanel", () => {
  it("renders empty state when there are no overlays", () => {
    // Act
    render(<OverlayPanel overlays={[]} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("overlay-panel")).toBeDefined();
    expect(screen.getByTestId("overlay-empty-state")).toBeDefined();
  });

  it("renders overlay cards for each overlay", () => {
    // Setup
    const overlays = [
      makeOverlay({ id: "overlay_a" }),
      makeOverlay({ id: "overlay_b", style: "bottom_sheet" }),
    ];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("overlay-list")).toBeDefined();
    expect(screen.getByTestId("overlay-card-overlay_a")).toBeDefined();
    expect(screen.getByTestId("overlay-card-overlay_b")).toBeDefined();
  });

  it("displays the overlay count badge", () => {
    // Setup
    const overlays = [makeOverlay({ id: "o1" }), makeOverlay({ id: "o2" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByText("2")).toBeDefined();
  });

  it("calls onChange with a new overlay when add button is clicked", () => {
    // Setup
    const onChange = vi.fn();

    // Act
    render(<OverlayPanel overlays={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("overlay-add-btn"));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const newOverlays = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(newOverlays).toHaveLength(1);
    expect(newOverlays[0]!.style).toBe("modal");
    expect(newOverlays[0]!.dismissible).toBe(true);
    expect(newOverlays[0]!.trigger).toEqual({ type: "manual" });
    expect(newOverlays[0]!.components).toEqual([]);
  });

  it("calls onChange without the removed overlay when remove is clicked", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [
      makeOverlay({ id: "keep" }),
      makeOverlay({ id: "remove_me" }),
    ];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("overlay-remove-remove_me"));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const result = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("keep");
  });

  it("updates overlay style when style select changes", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1", style: "modal" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-style-select-ov1"), {
      target: { value: "fullscreen" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.style).toBe("fullscreen");
  });

  it("updates overlay trigger when trigger select changes", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-trigger-select-ov1"), {
      target: { value: "on_load" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.trigger).toEqual({ type: "on_load" });
  });

  it("toggles dismissible when the switch is clicked", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1", dismissible: true })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("overlay-dismissible-ov1"));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.dismissible).toBe(false);
  });

  it("updates overlay ID when the id input changes", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-id-input-ov1"), {
      target: { value: "new_id" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.id).toBe("new_id");
  });

  it("updates dismissAfterMs when the number input changes", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-dismiss-ms-ov1"), {
      target: { value: "5000" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.dismissAfterMs).toBe(5000);
  });

  it("clears dismissAfterMs when the number input is emptied", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1", dismissAfterMs: 3000 })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-dismiss-ms-ov1"), {
      target: { value: "" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.dismissAfterMs).toBeUndefined();
  });

  it("updates components when valid JSON is entered", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];
    const newComponents = [
      { id: "t1", type: "text", props: { content: "Hi" } },
    ];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-components-json-ov1"), {
      target: { value: JSON.stringify(newComponents) },
    });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated[0]!.components).toEqual(newComponents);
  });

  it("does not call onChange when invalid JSON is entered", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-components-json-ov1"), {
      target: { value: "not-json" },
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when components JSON is not an array", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-components-json-ov1"), {
      target: { value: '{"not":"an array"}' },
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("collapses and expands an overlay card when toggle is clicked", () => {
    // Setup
    const overlays = [makeOverlay({ id: "ov1" })];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={vi.fn()} />);

    // Assert - initially expanded, style select should be visible
    expect(screen.getByTestId("overlay-style-select-ov1")).toBeDefined();

    // Act - collapse
    fireEvent.click(screen.getByTestId("overlay-toggle-ov1"));

    // Assert - style select should be hidden
    expect(screen.queryByTestId("overlay-style-select-ov1")).toBeNull();

    // Act - expand again
    fireEvent.click(screen.getByTestId("overlay-toggle-ov1"));

    // Assert - style select visible again
    expect(screen.getByTestId("overlay-style-select-ov1")).toBeDefined();
  });

  it("preserves other overlays when updating one", () => {
    // Setup
    const onChange = vi.fn();
    const overlays = [
      makeOverlay({ id: "first" }),
      makeOverlay({ id: "second", style: "bottom_sheet" }),
    ];

    // Act
    render(<OverlayPanel overlays={overlays} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("overlay-style-select-first"), {
      target: { value: "fullscreen" },
    });

    // Assert
    const updated = onChange.mock.calls[0]![0] as SduiOverlay[];
    expect(updated).toHaveLength(2);
    expect(updated[0]!.id).toBe("first");
    expect(updated[0]!.style).toBe("fullscreen");
    expect(updated[1]!.id).toBe("second");
    expect(updated[1]!.style).toBe("bottom_sheet");
  });
});
