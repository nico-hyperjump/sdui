import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Layers } from "lucide-react";
import type { FlatNode, BuilderAction } from "./types";
import { TreeNode } from "./tree-node";

/** Props for the `ComponentTree` panel. */
export interface ComponentTreeProps {
  /** Flat node array produced by `flattenTree`. */
  flatNodes: FlatNode[];
  /** Id of the currently selected component. */
  selectedId: string | null;
  /** Dispatch function from `useScreenBuilder`. */
  dispatch: React.Dispatch<BuilderAction>;
}

/**
 * Center panel of the screen builder: renders the component tree as a
 * flat sortable list. Supports drag-and-drop reordering, nesting
 * (handled by the parent DnD context), and component selection.
 */
export function ComponentTree({
  flatNodes,
  selectedId,
  dispatch,
}: ComponentTreeProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "tree-root" });
  const ids = flatNodes.map((n) => n.id);

  return (
    <div className="flex h-full flex-col" data-testid="component-tree">
      <div className="border-b border-slate-200 p-3 dark:border-slate-700">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Component Tree
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-2 ${
          isOver ? "bg-primary-50/50 dark:bg-primary-900/10" : ""
        }`}
        data-testid="tree-drop-area"
      >
        {flatNodes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 py-16 text-center"
            data-testid="tree-empty-state"
          >
            <Layers className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Drag components here
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600">
              Build your screen by dragging items from the palette
            </p>
          </div>
        ) : (
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-0.5">
              {flatNodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isSelected={node.id === selectedId}
                  onSelect={(id) => dispatch({ type: "SELECT_COMPONENT", id })}
                  onRemove={(id) => dispatch({ type: "REMOVE_COMPONENT", id })}
                  onDuplicate={(id) =>
                    dispatch({ type: "DUPLICATE_COMPONENT", id })
                  }
                  onToggleCollapse={(id) =>
                    dispatch({ type: "TOGGLE_COLLAPSE", id })
                  }
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
