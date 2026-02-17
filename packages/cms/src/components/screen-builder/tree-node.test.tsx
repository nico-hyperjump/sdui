import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { FlatNode } from "./types";
import { TreeNode } from "./tree-node";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeNode(overrides?: Partial<FlatNode>): FlatNode {
  return {
    id: "text_1",
    depth: 0,
    parentId: null,
    index: 0,
    collapsed: false,
    component: {
      id: "text_1",
      type: "text",
      props: { content: "Hello World" },
    },
    ...overrides,
  };
}

function renderNode(
  node: FlatNode,
  props?: Partial<React.ComponentProps<typeof TreeNode>>,
) {
  const defaultProps = {
    node,
    isSelected: false,
    onSelect: vi.fn(),
    onRemove: vi.fn(),
    onDuplicate: vi.fn(),
    onToggleCollapse: vi.fn(),
    ...props,
  };
  return render(
    <DndContext>
      <SortableContext items={[node.id]} strategy={verticalListSortingStrategy}>
        <TreeNode {...defaultProps} />
      </SortableContext>
    </DndContext>,
  );
}

describe("TreeNode", () => {
  it("renders with component type and display label", () => {
    // Setup
    const node = makeNode();

    // Act
    renderNode(node);

    // Assert
    const el = screen.getByTestId("tree-node-text_1");
    expect(el).toBeDefined();
    expect(el.textContent).toContain("Hello World");
    expect(el.textContent).toContain("text");
  });

  it("calls onSelect when node label is clicked", () => {
    // Setup
    const onSelect = vi.fn();
    const node = makeNode();

    // Act
    renderNode(node, { onSelect });
    fireEvent.click(screen.getByTestId("tree-node-select-text_1"));

    // Assert
    expect(onSelect).toHaveBeenCalledWith("text_1");
  });

  it("calls onRemove when delete button is clicked", () => {
    // Setup
    const onRemove = vi.fn();
    const node = makeNode();

    // Act
    renderNode(node, { onRemove });
    fireEvent.click(screen.getByTestId("tree-node-delete-text_1"));

    // Assert
    expect(onRemove).toHaveBeenCalledWith("text_1");
  });

  it("calls onDuplicate when duplicate button is clicked", () => {
    // Setup
    const onDuplicate = vi.fn();
    const node = makeNode();

    // Act
    renderNode(node, { onDuplicate });
    fireEvent.click(screen.getByTestId("tree-node-duplicate-text_1"));

    // Assert
    expect(onDuplicate).toHaveBeenCalledWith("text_1");
  });

  it("shows toggle chevron for container nodes with children", () => {
    // Setup
    const onToggleCollapse = vi.fn();
    const node = makeNode({
      id: "stack_1",
      component: {
        id: "stack_1",
        type: "stack",
        children: [{ id: "c1", type: "text" }],
      },
    });

    // Act
    renderNode(node, { onToggleCollapse });
    fireEvent.click(screen.getByTestId("tree-node-toggle-stack_1"));

    // Assert
    expect(onToggleCollapse).toHaveBeenCalledWith("stack_1");
  });

  it("does not show toggle for leaf nodes", () => {
    // Setup
    const node = makeNode();

    // Act
    renderNode(node);

    // Assert
    expect(screen.queryByTestId("tree-node-toggle-text_1")).toBeNull();
  });

  it("applies selected styling when isSelected is true", () => {
    // Setup
    const node = makeNode();

    // Act
    renderNode(node, { isSelected: true });

    // Assert
    const el = screen.getByTestId("tree-node-text_1");
    expect(el.className).toContain("border-primary-300");
  });

  it("truncates long labels at 30 characters", () => {
    // Setup
    const longContent = "A".repeat(50);
    const node = makeNode({
      component: {
        id: "text_1",
        type: "text",
        props: { content: longContent },
      },
    });

    // Act
    renderNode(node);

    // Assert
    const el = screen.getByTestId("tree-node-text_1");
    expect(el.textContent).toContain("A".repeat(30) + "...");
  });

  it("falls back to meta label when no props are present", () => {
    // Setup
    const node = makeNode({
      component: { id: "spacer_1", type: "spacer" },
      id: "spacer_1",
    });

    // Act
    renderNode(node);

    // Assert
    const el = screen.getByTestId("tree-node-spacer_1");
    expect(el.textContent).toContain("Spacer");
  });
});
