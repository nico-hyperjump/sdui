import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { SduiComponent } from "@workspace/sdui-schema";
import { ScreenBuilder } from "./index";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeSampleTree(): SduiComponent[] {
  return [
    {
      id: "stack_1",
      type: "stack",
      props: { gap: 8 },
      children: [{ id: "text_1", type: "text", props: { content: "Hello" } }],
    },
    { id: "image_1", type: "image", props: { uri: "https://x.png" } },
  ];
}

describe("ScreenBuilder", () => {
  it("renders the three-panel layout", () => {
    // Act
    render(<ScreenBuilder value={[]} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("screen-builder")).toBeDefined();
    expect(screen.getByTestId("component-palette")).toBeDefined();
    expect(screen.getByTestId("component-tree")).toBeDefined();
    expect(screen.getByTestId("property-panel")).toBeDefined();
  });

  it("renders empty tree state when value is empty", () => {
    // Act
    render(<ScreenBuilder value={[]} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("tree-empty-state")).toBeDefined();
  });

  it("renders tree nodes for provided components", () => {
    // Act
    render(<ScreenBuilder value={makeSampleTree()} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("tree-node-stack_1")).toBeDefined();
    expect(screen.getByTestId("tree-node-text_1")).toBeDefined();
    expect(screen.getByTestId("tree-node-image_1")).toBeDefined();
  });

  it("shows property panel empty state when nothing is selected", () => {
    // Act
    render(<ScreenBuilder value={makeSampleTree()} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("property-panel-empty")).toBeDefined();
  });

  it("selects a component and shows its properties", () => {
    // Act
    render(<ScreenBuilder value={makeSampleTree()} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId("tree-node-select-text_1"));

    // Assert
    expect(screen.getByTestId("property-type-header")).toBeDefined();
    expect(screen.getByTestId("prop-field-content")).toBeDefined();
  });

  it("calls onChange when a component is removed", () => {
    // Setup
    const onChange = vi.fn();
    render(<ScreenBuilder value={makeSampleTree()} onChange={onChange} />);

    // Act
    fireEvent.click(screen.getByTestId("tree-node-delete-image_1"));

    // Assert
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[
      onChange.mock.calls.length - 1
    ]![0] as SduiComponent[];
    expect(lastCall).toHaveLength(1);
    expect(lastCall[0]!.id).toBe("stack_1");
  });

  it("calls onChange when a component is duplicated", () => {
    // Setup
    const onChange = vi.fn();
    render(<ScreenBuilder value={makeSampleTree()} onChange={onChange} />);

    // Act
    fireEvent.click(screen.getByTestId("tree-node-duplicate-image_1"));

    // Assert
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[
      onChange.mock.calls.length - 1
    ]![0] as SduiComponent[];
    expect(lastCall).toHaveLength(3);
    expect(lastCall[2]!.type).toBe("image");
  });

  it("calls onChange when a property is edited", () => {
    // Setup
    const onChange = vi.fn();
    render(<ScreenBuilder value={makeSampleTree()} onChange={onChange} />);

    // Act
    fireEvent.click(screen.getByTestId("tree-node-select-text_1"));
    fireEvent.change(screen.getByTestId("prop-field-content"), {
      target: { value: "Updated" },
    });

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it("renders palette with all component categories", () => {
    // Act
    render(<ScreenBuilder value={[]} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("palette-category-Layout")).toBeDefined();
    expect(screen.getByTestId("palette-category-Content")).toBeDefined();
    expect(screen.getByTestId("palette-category-Interactive")).toBeDefined();
  });
});
