import { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Search } from "lucide-react";
import type { SduiComponentType } from "@workspace/sdui-schema";
import { COMPONENT_REGISTRY, PALETTE_CATEGORIES } from "./component-registry";
import type { ComponentMeta } from "./types";

// ---------------------------------------------------------------------------
// Draggable palette item
// ---------------------------------------------------------------------------

/** Props for a single draggable component entry in the palette. */
interface PaletteItemProps {
  /** The SDUI component type key. */
  componentType: SduiComponentType;
  /** Metadata for the component. */
  meta: ComponentMeta;
}

/**
 * A single draggable item in the component palette.
 * When dragged into the tree area, it creates a new component instance.
 */
function PaletteItem({ componentType, meta }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${componentType}`,
    data: { source: "palette", componentType },
  });

  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-all hover:border-primary-300 hover:shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-600 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
      data-testid={`palette-item-${componentType}`}
    >
      <Icon className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
      <span className="truncate text-slate-700 dark:text-slate-300">
        {meta.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Palette panel
// ---------------------------------------------------------------------------

/**
 * Left panel of the screen builder: a categorized, searchable list of
 * all available SDUI component types. Items are draggable and can be
 * dropped into the component tree.
 */
export function ComponentPalette() {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    const groups: Record<
      string,
      { type: SduiComponentType; meta: ComponentMeta }[]
    > = {};

    for (const category of PALETTE_CATEGORIES) {
      groups[category] = [];
    }

    for (const [type, meta] of Object.entries(COMPONENT_REGISTRY) as [
      SduiComponentType,
      ComponentMeta,
    ][]) {
      if (
        lowerSearch &&
        !meta.label.toLowerCase().includes(lowerSearch) &&
        !type.toLowerCase().includes(lowerSearch)
      ) {
        continue;
      }
      groups[meta.category]!.push({ type, meta });
    }

    return groups;
  }, [search]);

  return (
    <div className="flex h-full flex-col" data-testid="component-palette">
      <div className="border-b border-slate-200 p-3 dark:border-slate-700">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Components
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="palette-search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {PALETTE_CATEGORIES.map((category) => {
          const items = grouped[category];
          if (!items || items.length === 0) return null;
          return (
            <div
              key={category}
              className="mb-4"
              data-testid={`palette-category-${category}`}
            >
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {category}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {items.map(({ type, meta }) => (
                  <PaletteItem key={type} componentType={type} meta={meta} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
