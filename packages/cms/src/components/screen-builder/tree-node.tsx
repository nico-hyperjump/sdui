import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Trash2,
  Copy,
} from "lucide-react";
import type { FlatNode } from "./types";
import { COMPONENT_REGISTRY } from "./component-registry";

/** Indentation width in pixels per depth level. */
const INDENT_PX = 24;

/** Props for the `TreeNode` component. */
export interface TreeNodeProps {
  /** The flattened node to render. */
  node: FlatNode;
  /** Whether this node is currently selected. */
  isSelected: boolean;
  /** Called when the user clicks the node to select it. */
  onSelect: (id: string) => void;
  /** Called when the user clicks the delete button. */
  onRemove: (id: string) => void;
  /** Called when the user clicks the duplicate button. */
  onDuplicate: (id: string) => void;
  /** Called when the user toggles the expand/collapse chevron. */
  onToggleCollapse: (id: string) => void;
}

/**
 * Renders a single node in the component tree with drag handle,
 * expand/collapse chevron, type icon, label, and action buttons.
 * Uses `useSortable` from @dnd-kit for drag-and-drop reordering.
 */
export function TreeNode({
  node,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleCollapse,
}: TreeNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: { source: "tree", node },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${node.depth * INDENT_PX}px`,
  };

  const meta = COMPONENT_REGISTRY[node.component.type];
  const Icon = meta?.icon;
  const hasChildren =
    meta?.acceptsChildren && (node.component.children?.length ?? 0) > 0;

  const label = getDisplayLabel(node) || meta?.label || node.component.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 rounded-md border px-1.5 py-1.5 text-sm transition-colors ${
        isDragging
          ? "z-50 border-primary-400 bg-primary-50 opacity-80 shadow-md dark:border-primary-500 dark:bg-primary-900/30"
          : isSelected
            ? "border-primary-300 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20"
            : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
      }`}
      data-testid={`tree-node-${node.id}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:text-slate-500 dark:hover:text-slate-300"
        {...attributes}
        {...listeners}
        data-testid={`tree-node-handle-${node.id}`}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Collapse / expand chevron */}
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(node.id);
          }}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          data-testid={`tree-node-toggle-${node.id}`}
        >
          {node.collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      ) : (
        <span className="w-3.5" />
      )}

      {/* Icon + label (clickable to select) */}
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-left"
        onClick={() => onSelect(node.id)}
        data-testid={`tree-node-select-${node.id}`}
      >
        {Icon && (
          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
        )}
        <span className="truncate text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="ml-1 truncate text-[10px] text-slate-400 dark:text-slate-500">
          {node.component.type}
        </span>
      </button>

      {/* Action buttons (visible on hover or when selected) */}
      <div
        className={`flex shrink-0 items-center gap-0.5 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(node.id);
          }}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          title="Duplicate"
          data-testid={`tree-node-duplicate-${node.id}`}
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(node.id);
          }}
          className="rounded p-0.5 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Delete"
          data-testid={`tree-node-delete-${node.id}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/**
 * Derives a short display label from a component's props.
 * Falls back to empty string when no suitable prop is found.
 * @param node - The flat node to extract a label from.
 * @returns A display string, or `""`.
 */
function getDisplayLabel(node: FlatNode): string {
  const props = node.component.props;
  if (!props) return "";
  const candidates = ["label", "title", "content", "text", "message", "name"];
  for (const key of candidates) {
    const val = props[key];
    if (typeof val === "string" && val.length > 0) {
      return val.length > 30 ? val.slice(0, 30) + "..." : val;
    }
  }
  return "";
}
