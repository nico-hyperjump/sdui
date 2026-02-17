import { useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import type { SduiComponent, SduiComponentType } from "@workspace/sdui-schema";
import {
  useScreenBuilder,
  generateId,
  findComponentById,
} from "./use-screen-builder";
import { COMPONENT_REGISTRY } from "./component-registry";
import { ComponentPalette } from "./component-palette";
import { ComponentTree } from "./component-tree";
import { PropertyPanel } from "./property-panel";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for the `ScreenBuilder` component. */
export interface ScreenBuilderProps {
  /** Current component tree value. */
  value: SduiComponent[];
  /** Called whenever the component tree changes. */
  onChange: (components: SduiComponent[]) => void;
  /** Available screen IDs for the navigate action picker. */
  screenIds?: string[];
}

// ---------------------------------------------------------------------------
// Drag overlay label
// ---------------------------------------------------------------------------

/**
 * Light-weight overlay shown while dragging a component.
 */
function DragLabel({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 shadow-lg dark:border-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Three-panel screen builder with drag-and-drop:
 * - **Left**: Component palette (draggable items)
 * - **Center**: Component tree (sortable, nestable)
 * - **Right**: Property panel (edit selected component)
 *
 * Exposes a controlled `value` / `onChange` interface for
 * integration with the screen editor form.
 */
export function ScreenBuilder({
  value,
  onChange,
  screenIds,
}: ScreenBuilderProps) {
  const { state, dispatch, flatNodes, selectedComponent } =
    useScreenBuilder(value);

  // Keep parent in sync whenever the tree changes
  const prevJsonRef = useRef(JSON.stringify(value));
  useEffect(() => {
    const json = JSON.stringify(state.components);
    if (json !== prevJsonRef.current) {
      prevJsonRef.current = json;
      onChange(state.components);
    }
  }, [state.components, onChange]);

  // Sync external value changes into the builder
  useEffect(() => {
    const externalJson = JSON.stringify(value);
    if (externalJson !== prevJsonRef.current) {
      prevJsonRef.current = externalJson;
      dispatch({ type: "SET_COMPONENTS", components: value });
    }
  }, [value, dispatch]);

  // Drag state for overlay
  const [dragLabel, setDragLabel] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const data = active.data.current as
        | { source: "palette"; componentType: SduiComponentType }
        | { source: "tree" }
        | undefined;

      if (data?.source === "palette") {
        const meta = COMPONENT_REGISTRY[data.componentType];
        setDragLabel(meta?.label ?? data.componentType);
      } else if (data?.source === "tree") {
        const comp = findComponentById(state.components, String(active.id));
        const meta = comp ? COMPONENT_REGISTRY[comp.type] : undefined;
        setDragLabel(meta?.label ?? String(active.id));
      }
    },
    [state.components],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDragLabel(null);
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as
        | { source: "palette"; componentType: SduiComponentType }
        | { source: "tree" }
        | undefined;

      if (activeData?.source === "palette") {
        const componentType = activeData.componentType;
        const meta = COMPONENT_REGISTRY[componentType];
        const defaultProps: Record<string, unknown> = {};
        for (const field of meta?.propFields ?? []) {
          if (field.defaultValue !== undefined) {
            defaultProps[field.name] = field.defaultValue;
          }
        }

        const newComponent: SduiComponent = {
          id: generateId(componentType),
          type: componentType,
          props:
            Object.keys(defaultProps).length > 0 ? defaultProps : undefined,
          children: meta?.acceptsChildren ? [] : undefined,
        };

        // Determine insertion point
        const overId = String(over.id);
        if (overId === "tree-root") {
          dispatch({
            type: "ADD_COMPONENT",
            parentId: null,
            index: state.components.length,
            component: newComponent,
          });
        } else {
          const overNode = flatNodes.find((n) => n.id === overId);
          if (overNode) {
            const overMeta = COMPONENT_REGISTRY[overNode.component.type];
            if (overMeta?.acceptsChildren) {
              dispatch({
                type: "ADD_COMPONENT",
                parentId: overId,
                index: overNode.component.children?.length ?? 0,
                component: newComponent,
              });
            } else {
              dispatch({
                type: "ADD_COMPONENT",
                parentId: overNode.parentId,
                index: overNode.index + 1,
                component: newComponent,
              });
            }
          }
        }
      } else if (activeData?.source === "tree") {
        const activeId = String(active.id);
        const overId = String(over.id);
        if (activeId === overId) return;

        if (overId === "tree-root") {
          dispatch({
            type: "MOVE_COMPONENT",
            id: activeId,
            newParentId: null,
            newIndex: state.components.length,
          });
        } else {
          const overNode = flatNodes.find((n) => n.id === overId);
          if (overNode) {
            dispatch({
              type: "MOVE_COMPONENT",
              id: activeId,
              newParentId: overNode.parentId,
              newIndex: overNode.index,
            });
          }
        }
      }
    },
    [state.components, flatNodes, dispatch],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid h-[600px] grid-cols-[240px_1fr_280px] overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
        data-testid="screen-builder"
      >
        {/* Left: Component palette */}
        <div className="overflow-hidden border-r border-slate-200 dark:border-slate-700">
          <ComponentPalette />
        </div>

        {/* Center: Component tree */}
        <div className="overflow-hidden">
          <ComponentTree
            flatNodes={flatNodes}
            selectedId={state.selectedId}
            dispatch={dispatch}
          />
        </div>

        {/* Right: Property panel */}
        <div className="overflow-hidden border-l border-slate-200 dark:border-slate-700">
          <PropertyPanel
            component={selectedComponent}
            dispatch={dispatch}
            screenIds={screenIds}
          />
        </div>
      </div>

      <DragOverlay>
        {dragLabel ? <DragLabel label={dragLabel} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
