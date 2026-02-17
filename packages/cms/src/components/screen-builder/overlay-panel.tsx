import { useCallback, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Layers } from "lucide-react";
import type { SduiOverlay, SduiOverlayStyle } from "@workspace/sdui-schema";
import { generateId } from "./use-screen-builder";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for the `OverlayPanel` component. */
export interface OverlayPanelProps {
  /** Current overlays array. */
  overlays: SduiOverlay[];
  /** Called whenever the overlays array changes. */
  onChange: (overlays: SduiOverlay[]) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const OVERLAY_STYLES: { label: string; value: SduiOverlayStyle }[] = [
  { label: "Modal", value: "modal" },
  { label: "Bottom Sheet", value: "bottom_sheet" },
  { label: "Fullscreen", value: "fullscreen" },
];

const TRIGGER_TYPES = [
  { label: "Manual", value: "manual" },
  { label: "On Load", value: "on_load" },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Editor card for a single overlay, with fields for id, style, trigger,
 * dismissible, dismissAfterMs, and a JSON textarea for components.
 */
function OverlayCard({
  overlay,
  onUpdate,
  onRemove,
}: {
  overlay: SduiOverlay;
  onUpdate: (updated: SduiOverlay) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [componentsJson, setComponentsJson] = useState(() =>
    JSON.stringify(overlay.components, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  /** Handles changes to the overlay's component JSON textarea. */
  const handleComponentsJsonChange = useCallback(
    (value: string) => {
      setComponentsJson(value);
      try {
        const parsed = JSON.parse(value) as unknown;
        if (!Array.isArray(parsed)) {
          setJsonError("Components must be a JSON array");
          return;
        }
        setJsonError(null);
        onUpdate({ ...overlay, components: parsed });
      } catch (e) {
        setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      }
    },
    [overlay, onUpdate],
  );

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50"
      data-testid={`overlay-card-${overlay.id}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          data-testid={`overlay-toggle-${overlay.id}`}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <Layers className="h-4 w-4 text-slate-400" />
        <span className="flex-1 truncate font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
          {overlay.id}
        </span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          {overlay.style}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
          data-testid={`overlay-remove-${overlay.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="space-y-3 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
          {/* ID */}
          <div>
            <label
              htmlFor={`overlay-id-${overlay.id}`}
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Overlay ID
            </label>
            <input
              id={`overlay-id-${overlay.id}`}
              type="text"
              value={overlay.id}
              onChange={(e) => onUpdate({ ...overlay, id: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              data-testid={`overlay-id-input-${overlay.id}`}
            />
          </div>

          {/* Style + Trigger row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`overlay-style-${overlay.id}`}
                className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Style
              </label>
              <select
                id={`overlay-style-${overlay.id}`}
                value={overlay.style}
                onChange={(e) =>
                  onUpdate({
                    ...overlay,
                    style: e.target.value as SduiOverlayStyle,
                  })
                }
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                data-testid={`overlay-style-select-${overlay.id}`}
              >
                {OVERLAY_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`overlay-trigger-${overlay.id}`}
                className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Trigger
              </label>
              <select
                id={`overlay-trigger-${overlay.id}`}
                value={overlay.trigger.type}
                onChange={(e) =>
                  onUpdate({
                    ...overlay,
                    trigger: {
                      type: e.target.value as "manual" | "on_load",
                    },
                  })
                }
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                data-testid={`overlay-trigger-select-${overlay.id}`}
              >
                {TRIGGER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dismissible + DismissAfterMs row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 pt-5">
              <button
                type="button"
                role="switch"
                aria-checked={overlay.dismissible}
                onClick={() =>
                  onUpdate({ ...overlay, dismissible: !overlay.dismissible })
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  overlay.dismissible
                    ? "bg-primary-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
                data-testid={`overlay-dismissible-${overlay.id}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    overlay.dismissible ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Dismissible
              </label>
            </div>
            <div>
              <label
                htmlFor={`overlay-dismiss-ms-${overlay.id}`}
                className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Auto-dismiss (ms)
              </label>
              <input
                id={`overlay-dismiss-ms-${overlay.id}`}
                type="number"
                min={0}
                value={overlay.dismissAfterMs ?? ""}
                onChange={(e) =>
                  onUpdate({
                    ...overlay,
                    dismissAfterMs:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="e.g. 5000"
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                data-testid={`overlay-dismiss-ms-${overlay.id}`}
              />
            </div>
          </div>

          {/* Components JSON editor */}
          <div>
            <label
              htmlFor={`overlay-components-${overlay.id}`}
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Components
            </label>
            {jsonError && (
              <p className="mb-1 text-[10px] text-red-500">{jsonError}</p>
            )}
            <textarea
              id={`overlay-components-${overlay.id}`}
              value={componentsJson}
              onChange={(e) => handleComponentsJsonChange(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs leading-relaxed text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
              data-testid={`overlay-components-json-${overlay.id}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Panel for managing screen-level overlays (modals, bottom sheets, fullscreen).
 * Displays a list of overlay cards with add/remove controls and inline editors
 * for overlay properties and component content.
 */
export function OverlayPanel({ overlays, onChange }: OverlayPanelProps) {
  /** Creates a new overlay with default values. */
  const handleAdd = useCallback(() => {
    const newOverlay: SduiOverlay = {
      id: generateId("overlay"),
      style: "modal",
      dismissible: true,
      trigger: { type: "manual" },
      components: [],
    };
    onChange([...overlays, newOverlay]);
  }, [overlays, onChange]);

  /** Updates an overlay at the given index. */
  const handleUpdate = useCallback(
    (index: number, updated: SduiOverlay) => {
      const next = [...overlays];
      next[index] = updated;
      onChange(next);
    },
    [overlays, onChange],
  );

  /** Removes an overlay at the given index. */
  const handleRemove = useCallback(
    (index: number) => {
      onChange(overlays.filter((_, i) => i !== index));
    },
    [overlays, onChange],
  );

  return (
    <div
      className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      data-testid="overlay-panel"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Overlays
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            {overlays.length}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          data-testid="overlay-add-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Overlay
        </button>
      </div>

      {overlays.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-slate-700"
          data-testid="overlay-empty-state"
        >
          <Layers className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No overlays defined
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Add a modal, bottom sheet, or fullscreen overlay
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="overlay-list">
          {overlays.map((overlay, index) => (
            <OverlayCard
              key={overlay.id}
              overlay={overlay}
              onUpdate={(updated) => handleUpdate(index, updated)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
