import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import type { FlatNode, BuilderAction } from "./types";
import { ComponentTree } from "./component-tree";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeFlatNodes(): FlatNode[] {
  return [
    {
      id: "stack_1",
      depth: 0,
      parentId: null,
      index: 0,
      collapsed: false,
      component: {
        id: "stack_1",
        type: "stack",
        children: [{ id: "text_1", type: "text", props: { content: "Hi" } }],
      },
    },
    {
      id: "text_1",
      depth: 1,
      parentId: "stack_1",
      index: 0,
      collapsed: false,
      component: { id: "text_1", type: "text", props: { content: "Hi" } },
    },
  ];
}

function renderTree(
  flatNodes: FlatNode[],
  overrides?: {
    selectedId?: string | null;
    dispatch?: React.Dispatch<BuilderAction>;
  },
) {
  const dispatch = overrides?.dispatch ?? vi.fn();
  return {
    dispatch,
    ...render(
      <DndContext>
        <ComponentTree
          flatNodes={flatNodes}
          selectedId={overrides?.selectedId ?? null}
          dispatch={dispatch}
        />
      </DndContext>,
    ),
  };
}

describe("ComponentTree", () => {
  it("renders the tree container", () => {
    // Act
    renderTree(makeFlatNodes());

    // Assert
    expect(screen.getByTestId("component-tree")).toBeDefined();
  });

  it("renders empty state when no nodes are present", () => {
    // Act
    renderTree([]);

    // Assert
    expect(screen.getByTestId("tree-empty-state")).toBeDefined();
  });

  it("renders tree nodes for each flat node", () => {
    // Act
    renderTree(makeFlatNodes());

    // Assert
    expect(screen.getByTestId("tree-node-stack_1")).toBeDefined();
    expect(screen.getByTestId("tree-node-text_1")).toBeDefined();
  });

  it("dispatches SELECT_COMPONENT when a node is clicked", () => {
    // Setup
    const dispatch = vi.fn();

    // Act
    renderTree(makeFlatNodes(), { dispatch });
    fireEvent.click(screen.getByTestId("tree-node-select-text_1"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "SELECT_COMPONENT",
      id: "text_1",
    });
  });

  it("dispatches REMOVE_COMPONENT when delete is clicked", () => {
    // Setup
    const dispatch = vi.fn();

    // Act
    renderTree(makeFlatNodes(), { dispatch });
    fireEvent.click(screen.getByTestId("tree-node-delete-text_1"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "REMOVE_COMPONENT",
      id: "text_1",
    });
  });

  it("dispatches DUPLICATE_COMPONENT when duplicate is clicked", () => {
    // Setup
    const dispatch = vi.fn();

    // Act
    renderTree(makeFlatNodes(), { dispatch });
    fireEvent.click(screen.getByTestId("tree-node-duplicate-text_1"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "DUPLICATE_COMPONENT",
      id: "text_1",
    });
  });

  it("dispatches TOGGLE_COLLAPSE when toggle is clicked on a container", () => {
    // Setup
    const dispatch = vi.fn();

    // Act
    renderTree(makeFlatNodes(), { dispatch });
    fireEvent.click(screen.getByTestId("tree-node-toggle-stack_1"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "TOGGLE_COLLAPSE",
      id: "stack_1",
    });
  });

  it("highlights selected node", () => {
    // Act
    renderTree(makeFlatNodes(), { selectedId: "text_1" });

    // Assert
    const node = screen.getByTestId("tree-node-text_1");
    expect(node.className).toContain("border-primary-300");
  });
});
