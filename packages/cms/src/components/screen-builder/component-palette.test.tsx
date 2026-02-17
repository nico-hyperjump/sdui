import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import { ComponentPalette } from "./component-palette";
import { PALETTE_CATEGORIES, COMPONENT_REGISTRY } from "./component-registry";

afterEach(() => {
  cleanup();
});

/** Wraps components in a DndContext required by useDraggable. */
function renderInDndContext(ui: React.ReactElement) {
  return render(<DndContext>{ui}</DndContext>);
}

describe("ComponentPalette", () => {
  it("renders the palette container", () => {
    // Act
    renderInDndContext(<ComponentPalette />);

    // Assert
    expect(screen.getByTestId("component-palette")).toBeDefined();
  });

  it("renders all category headers", () => {
    // Act
    renderInDndContext(<ComponentPalette />);

    // Assert
    for (const category of PALETTE_CATEGORIES) {
      expect(screen.getByTestId(`palette-category-${category}`)).toBeDefined();
    }
  });

  it("renders all 53 component items", () => {
    // Act
    renderInDndContext(<ComponentPalette />);

    // Assert
    const totalComponents = Object.keys(COMPONENT_REGISTRY).length;
    for (const type of Object.keys(COMPONENT_REGISTRY)) {
      expect(screen.getByTestId(`palette-item-${type}`)).toBeDefined();
    }
    expect(totalComponents).toBe(53);
  });

  it("filters components by search text", () => {
    // Act
    renderInDndContext(<ComponentPalette />);
    const input = screen.getByTestId("palette-search");
    fireEvent.change(input, { target: { value: "button" } });

    // Assert
    expect(screen.getByTestId("palette-item-button")).toBeDefined();
    expect(
      screen.getByTestId("palette-item-floating_action_button"),
    ).toBeDefined();
    expect(screen.queryByTestId("palette-item-text")).toBeNull();
  });

  it("hides empty categories during search", () => {
    // Act
    renderInDndContext(<ComponentPalette />);
    fireEvent.change(screen.getByTestId("palette-search"), {
      target: { value: "hero" },
    });

    // Assert
    expect(screen.getByTestId("palette-category-Composite")).toBeDefined();
    expect(screen.queryByTestId("palette-category-Layout")).toBeNull();
  });

  it("restores all components when search is cleared", () => {
    // Act
    renderInDndContext(<ComponentPalette />);
    const input = screen.getByTestId("palette-search");
    fireEvent.change(input, { target: { value: "qr" } });
    fireEvent.change(input, { target: { value: "" } });

    // Assert
    expect(screen.getByTestId("palette-item-text")).toBeDefined();
    expect(screen.getByTestId("palette-item-qr_code")).toBeDefined();
  });
});
