import { useState, useCallback } from "react";
import { Settings2, Plus, Trash2 } from "lucide-react";
import type {
  SduiComponent,
  SduiAction,
  SduiCondition,
} from "@workspace/sdui-schema";
import { COMPONENT_REGISTRY } from "./component-registry";
import type { PropFieldDef, BuilderAction } from "./types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for the `PropertyPanel` component. */
export interface PropertyPanelProps {
  /** The currently selected component to edit, or `null`. */
  component: SduiComponent | null;
  /** Dispatch function from `useScreenBuilder`. */
  dispatch: React.Dispatch<BuilderAction>;
  /** Available screen IDs for the navigate action picker. */
  screenIds?: string[];
}

// ---------------------------------------------------------------------------
// Action types for the action editor sub-form
// ---------------------------------------------------------------------------

const ACTION_TYPES = [
  { label: "None", value: "" },
  { label: "Navigate", value: "navigate" },
  { label: "WebView", value: "webview" },
  { label: "Custom", value: "custom" },
  { label: "Show Overlay", value: "show_overlay" },
  { label: "Dismiss Overlay", value: "dismiss_overlay" },
] as const;

const CONDITION_OPERATORS = [
  { label: "Equals", value: "eq" },
  { label: "Not Equals", value: "neq" },
  { label: "In", value: "in" },
  { label: "Not In", value: "not_in" },
  { label: "Greater Than", value: "gt" },
  { label: "Less Than", value: "lt" },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Renders the correct input widget for a property field definition.
 */
function PropField({
  field,
  value,
  onChange,
}: {
  field: PropFieldDef;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}) {
  const id = `prop-${field.name}`;

  switch (field.type) {
    case "string":
    case "url":
    case "color":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            {field.label}
          </label>
          <input
            id={id}
            type={
              field.type === "url"
                ? "url"
                : field.type === "color"
                  ? "color"
                  : "text"
            }
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid={`prop-field-${field.name}`}
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            {field.label}
          </label>
          <input
            id={id}
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(e) =>
              onChange(
                field.name,
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid={`prop-field-${field.name}`}
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(field.name, !value)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              value ? "bg-primary-500" : "bg-slate-200 dark:bg-slate-700"
            }`}
            data-testid={`prop-field-${field.name}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                value ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {field.label}
          </label>
        </div>
      );

    case "select":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            {field.label}
          </label>
          <select
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid={`prop-field-${field.name}`}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "json":
      return (
        <div>
          <label
            htmlFor={id}
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            {field.label}
          </label>
          <textarea
            id={id}
            value={
              typeof value === "string"
                ? value
                : JSON.stringify(value ?? "", null, 2)
            }
            onChange={(e) => {
              try {
                onChange(field.name, JSON.parse(e.target.value) as unknown);
              } catch {
                onChange(field.name, e.target.value);
              }
            }}
            rows={3}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid={`prop-field-${field.name}`}
          />
        </div>
      );

    default:
      return null;
  }
}

/**
 * Sub-form for editing a component's action (navigate, webview, etc).
 * Accepts an optional list of available screen IDs for the navigate picker.
 */
function ActionEditor({
  action,
  onChange,
  screenIds = [],
}: {
  action: SduiAction | undefined;
  onChange: (action: SduiAction | undefined) => void;
  /** Available screen IDs to populate the navigate screen picker. */
  screenIds?: string[];
}) {
  const currentType = action?.type ?? "";

  return (
    <div className="space-y-2" data-testid="action-editor">
      <label
        htmlFor="action-type"
        className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
      >
        Action Type
      </label>
      <select
        id="action-type"
        value={currentType}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            onChange(undefined);
            return;
          }
          switch (val) {
            case "navigate":
              onChange({ type: "navigate", screen: "" });
              break;
            case "webview":
              onChange({ type: "webview", url: "" });
              break;
            case "custom":
              onChange({ type: "custom", name: "" });
              break;
            case "show_overlay":
              onChange({ type: "show_overlay", overlayId: "" });
              break;
            case "dismiss_overlay":
              onChange({ type: "dismiss_overlay" });
              break;
          }
        }}
        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        data-testid="action-type-select"
      >
        {ACTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {action?.type === "navigate" && (
        <div>
          <label
            htmlFor="action-screen"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Screen
          </label>
          <select
            id="action-screen"
            value={action.screen}
            onChange={(e) => onChange({ ...action, screen: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="action-screen-select"
          >
            <option value="">Select a screen…</option>
            {screenIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
            {action.screen && !screenIds.includes(action.screen) && (
              <option value={action.screen}>{action.screen}</option>
            )}
          </select>
        </div>
      )}

      {action?.type === "webview" && (
        <div>
          <label
            htmlFor="action-url"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            URL
          </label>
          <input
            id="action-url"
            type="url"
            value={action.url}
            onChange={(e) => onChange({ ...action, url: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="action-url-input"
          />
        </div>
      )}

      {action?.type === "custom" && (
        <div>
          <label
            htmlFor="action-name"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Action Name
          </label>
          <input
            id="action-name"
            type="text"
            value={action.name}
            onChange={(e) => onChange({ ...action, name: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="action-name-input"
          />
        </div>
      )}

      {action?.type === "show_overlay" && (
        <div>
          <label
            htmlFor="action-overlay-id"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            Overlay ID
          </label>
          <input
            id="action-overlay-id"
            type="text"
            value={action.overlayId}
            onChange={(e) => onChange({ ...action, overlayId: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="action-overlay-input"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Sub-form for editing component visibility conditions.
 */
function ConditionsEditor({
  conditions,
  onChange,
}: {
  conditions: SduiCondition[] | undefined;
  onChange: (conditions: SduiCondition[] | undefined) => void;
}) {
  const items = conditions ?? [];

  return (
    <div className="space-y-2" data-testid="conditions-editor">
      {items.map((cond, i) => (
        <div key={i} className="flex items-end gap-1.5">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Field
            </label>
            <input
              type="text"
              value={cond.field}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...cond, field: e.target.value };
                onChange(next);
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              data-testid={`condition-field-${i}`}
            />
          </div>
          <div className="w-20">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Op
            </label>
            <select
              value={cond.operator}
              onChange={(e) => {
                const next = [...items];
                next[i] = {
                  ...cond,
                  operator: e.target.value as SduiCondition["operator"],
                };
                onChange(next);
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-1 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              data-testid={`condition-op-${i}`}
            >
              {CONDITION_OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Value
            </label>
            <input
              type="text"
              value={
                typeof cond.value === "string"
                  ? cond.value
                  : JSON.stringify(cond.value)
              }
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...cond, value: e.target.value };
                onChange(next);
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              data-testid={`condition-value-${i}`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const next = items.filter((_, idx) => idx !== i);
              onChange(next.length > 0 ? next : undefined);
            }}
            className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
            data-testid={`condition-remove-${i}`}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...items, { field: "", operator: "eq", value: "" }])
        }
        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
        data-testid="condition-add"
      >
        <Plus className="h-3 w-3" /> Add condition
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main property panel
// ---------------------------------------------------------------------------

/**
 * Right panel of the screen builder: edits the properties of the
 * currently selected component. Renders dynamic form fields based
 * on the component registry, plus action and conditions editors.
 */
export function PropertyPanel({
  component,
  dispatch,
  screenIds = [],
}: PropertyPanelProps) {
  const [customPropsJson, setCustomPropsJson] = useState("");

  const handlePropChange = useCallback(
    (name: string, value: unknown) => {
      if (!component) return;
      const currentProps = component.props ?? {};
      dispatch({
        type: "UPDATE_COMPONENT",
        id: component.id,
        updates: {
          props: { ...currentProps, [name]: value },
        },
      });
    },
    [component, dispatch],
  );

  const handleActionChange = useCallback(
    (action: SduiAction | undefined) => {
      if (!component) return;
      dispatch({
        type: "UPDATE_COMPONENT",
        id: component.id,
        updates: { action },
      });
    },
    [component, dispatch],
  );

  const handleConditionsChange = useCallback(
    (conditions: SduiCondition[] | undefined) => {
      if (!component) return;
      dispatch({
        type: "UPDATE_COMPONENT",
        id: component.id,
        updates: { conditions },
      });
    },
    [component, dispatch],
  );

  const handleIdChange = useCallback(
    (newId: string) => {
      if (!component) return;
      dispatch({
        type: "UPDATE_COMPONENT",
        id: component.id,
        updates: { id: newId },
      });
    },
    [component, dispatch],
  );

  if (!component) {
    return (
      <div className="flex h-full flex-col" data-testid="property-panel">
        <div className="border-b border-slate-200 p-3 dark:border-slate-700">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Properties
          </h3>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center"
          data-testid="property-panel-empty"
        >
          <Settings2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Select a component to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const meta = COMPONENT_REGISTRY[component.type];
  const Icon = meta?.icon;
  const propFields = meta?.propFields ?? [];
  const registeredPropNames = new Set(propFields.map((f) => f.name));

  const extraProps = Object.entries(component.props ?? {}).filter(
    ([key]) => !registeredPropNames.has(key),
  );

  return (
    <div className="flex h-full flex-col" data-testid="property-panel">
      <div className="border-b border-slate-200 p-3 dark:border-slate-700">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Properties
        </h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {/* Component type header */}
        <div
          className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
          data-testid="property-type-header"
        >
          {Icon && <Icon className="h-4 w-4 text-slate-500" />}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {meta?.label ?? component.type}
          </span>
          <span className="text-[10px] text-slate-400">{component.type}</span>
        </div>

        {/* Component ID */}
        <div>
          <label
            htmlFor="component-id"
            className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
          >
            ID
          </label>
          <input
            id="component-id"
            type="text"
            value={component.id}
            onChange={(e) => handleIdChange(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="prop-field-id"
          />
        </div>

        {/* Registered prop fields */}
        {propFields.length > 0 && (
          <fieldset className="space-y-3" data-testid="registered-props">
            <legend className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Props
            </legend>
            {propFields.map((field) => (
              <PropField
                key={field.name}
                field={field}
                value={component.props?.[field.name]}
                onChange={handlePropChange}
              />
            ))}
          </fieldset>
        )}

        {/* Action editor */}
        <fieldset className="space-y-2" data-testid="action-section">
          <legend className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Action
          </legend>
          <ActionEditor
            action={component.action}
            onChange={handleActionChange}
            screenIds={screenIds}
          />
        </fieldset>

        {/* Conditions editor */}
        <fieldset className="space-y-2" data-testid="conditions-section">
          <legend className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Conditions
          </legend>
          <ConditionsEditor
            conditions={component.conditions}
            onChange={handleConditionsChange}
          />
        </fieldset>

        {/* Extra (unregistered) props as JSON */}
        {extraProps.length > 0 && (
          <fieldset className="space-y-2" data-testid="extra-props-section">
            <legend className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Custom Props
            </legend>
            <pre className="rounded-md border border-slate-100 bg-slate-50 p-2 font-mono text-[10px] leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              {JSON.stringify(Object.fromEntries(extraProps), null, 2)}
            </pre>
          </fieldset>
        )}

        {/* Add custom props */}
        <fieldset className="space-y-2">
          <legend className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Add Custom Prop
          </legend>
          <textarea
            value={customPropsJson}
            onChange={(e) => setCustomPropsJson(e.target.value)}
            placeholder='{"key": "value"}'
            rows={2}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="custom-props-input"
          />
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(customPropsJson) as Record<
                  string,
                  unknown
                >;
                if (typeof parsed === "object" && parsed !== null) {
                  dispatch({
                    type: "UPDATE_COMPONENT",
                    id: component.id,
                    updates: {
                      props: { ...(component.props ?? {}), ...parsed },
                    },
                  });
                  setCustomPropsJson("");
                }
              } catch {
                /* ignore invalid JSON */
              }
            }}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
            data-testid="custom-props-apply"
          >
            <Plus className="h-3 w-3" /> Apply
          </button>
        </fieldset>
      </div>
    </div>
  );
}
