import { useState, useRef, useEffect, useCallback } from "react";
import { Braces, ChevronRight, ChevronDown } from "lucide-react";
import type {
  SduiDataSource,
  DataProviderSchema,
  DataProviderFieldSchema,
} from "@workspace/sdui-schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for the `DataBindingPicker` component. */
export interface DataBindingPickerProps {
  /** Data sources attached to the current screen. */
  dataSources: SduiDataSource[];
  /** Available provider schemas from the catalog API. */
  providerSchemas: DataProviderSchema[];
  /** Called when a field is selected; receives the expression to insert. */
  onSelect: (expression: string) => void;
}

// ---------------------------------------------------------------------------
// Field tree node
// ---------------------------------------------------------------------------

/**
 * Renders a single field in the picker tree. Expandable for object/array types.
 */
function FieldNode({
  field,
  path,
  onSelect,
}: {
  field: DataProviderFieldSchema;
  path: string;
  onSelect: (expression: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = field.children && field.children.length > 0;
  const fullPath = `${path}.${field.name}`;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          data-testid={`binding-field-${fullPath}`}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0" />
          )}
          <span className="font-medium">{field.label}</span>
          <span className="ml-auto text-[10px] text-slate-400">
            {field.type}
          </span>
        </button>
        {expanded && (
          <div className="ml-3 border-l border-slate-200 pl-1 dark:border-slate-700">
            {field.children!.map((child) => (
              <FieldNode
                key={child.name}
                field={child}
                path={fullPath}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(`{{${fullPath}}}`)}
      className="flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-xs text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
      data-testid={`binding-field-${fullPath}`}
    >
      <span className="ml-4">{field.label}</span>
      <span className="ml-auto font-mono text-[10px] text-slate-400">
        {field.type}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Popover button that opens a picker tree of available data source fields.
 * Clicking a leaf field inserts the corresponding `{{source.field}}` expression.
 */
export function DataBindingPicker({
  dataSources,
  providerSchemas,
  onSelect,
}: DataBindingPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Close popover when clicking outside. */
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  /**
   * Handles field selection: inserts the expression and closes the popover.
   *
   * @param expression - The template expression to insert.
   */
  function handleSelect(expression: string) {
    onSelect(expression);
    setOpen(false);
  }

  const hasDataSources = dataSources.length > 0;

  if (!hasDataSources) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      data-testid="data-binding-picker"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-primary-500 dark:hover:text-primary-400"
        title="Bind to data source"
        data-testid="data-binding-trigger"
      >
        <Braces className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
          data-testid="data-binding-popover"
        >
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Insert data binding
            </p>
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {dataSources.map((ds) => {
              const schema = providerSchemas.find(
                (s) => s.name === ds.provider,
              );
              if (!schema) return null;

              return (
                <div
                  key={ds.id}
                  className="mb-2"
                  data-testid={`binding-source-${ds.id}`}
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {schema.label}
                    {ds.id !== ds.provider && (
                      <span className="ml-1 font-mono font-normal lowercase text-slate-400">
                        ({ds.id})
                      </span>
                    )}
                  </p>
                  <div className="space-y-0.5">
                    {schema.fields.map((field) => (
                      <FieldNode
                        key={field.name}
                        field={field}
                        path={ds.id}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
