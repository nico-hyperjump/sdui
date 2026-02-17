import { Plus, Trash2, Database } from "lucide-react";
import type {
  SduiDataSource,
  DataProviderSchema,
} from "@workspace/sdui-schema";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props for the `DataSourcePanel` component. */
export interface DataSourcePanelProps {
  /** Current data sources attached to the screen. */
  dataSources: SduiDataSource[];
  /** Called when data sources change. */
  onChange: (dataSources: SduiDataSource[]) => void;
  /** Available provider schemas from the catalog API. */
  providerSchemas: DataProviderSchema[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Panel for managing data sources on a screen. Admins can add data sources
 * from the provider catalog, configure their alias and parameters, and
 * remove sources they no longer need.
 */
export function DataSourcePanel({
  dataSources,
  onChange,
  providerSchemas,
}: DataSourcePanelProps) {
  /**
   * Adds a new data source from the selected provider.
   *
   * @param providerName - The provider name to add.
   */
  function handleAdd(providerName: string) {
    const schema = providerSchemas.find((s) => s.name === providerName);
    if (!schema) return;

    const defaultParams: Record<string, unknown> = {};
    for (const param of schema.params ?? []) {
      if (param.defaultValue !== undefined) {
        defaultParams[param.name] = param.defaultValue;
      }
    }

    const newSource: SduiDataSource = {
      id: providerName,
      provider: providerName,
      ...(Object.keys(defaultParams).length > 0
        ? { params: defaultParams }
        : {}),
    };
    onChange([...dataSources, newSource]);
  }

  /**
   * Removes a data source by index.
   *
   * @param index - Index of the data source to remove.
   */
  function handleRemove(index: number) {
    onChange(dataSources.filter((_, i) => i !== index));
  }

  /**
   * Updates the alias (id) of a data source.
   *
   * @param index - Index of the data source to update.
   * @param newId - New alias value.
   */
  function handleAliasChange(index: number, newId: string) {
    const updated = dataSources.map((ds, i) =>
      i === index ? { ...ds, id: newId } : ds,
    );
    onChange(updated);
  }

  /**
   * Updates a single parameter value on a data source.
   *
   * @param index - Index of the data source.
   * @param paramName - Parameter name to update.
   * @param value - New parameter value.
   */
  function handleParamChange(index: number, paramName: string, value: unknown) {
    const updated = dataSources.map((ds, i) => {
      if (i !== index) return ds;
      return { ...ds, params: { ...(ds.params ?? {}), [paramName]: value } };
    });
    onChange(updated);
  }

  const usedProviders = new Set(dataSources.map((ds) => ds.provider));
  const availableProviders = providerSchemas.filter(
    (s) => !usedProviders.has(s.name),
  );

  return (
    <div data-testid="data-source-panel">
      <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-700">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Database className="h-3.5 w-3.5" />
          Data Sources
        </h3>
        {availableProviders.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAdd(e.target.value);
                e.target.value = "";
              }
            }}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:border-primary-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            data-testid="add-data-source-select"
            defaultValue=""
          >
            <option value="" disabled>
              + Add source…
            </option>
            {availableProviders.map((schema) => (
              <option key={schema.name} value={schema.name}>
                {schema.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2 p-3">
        {dataSources.length === 0 && (
          <p
            className="py-4 text-center text-xs text-slate-400 dark:text-slate-500"
            data-testid="data-source-empty"
          >
            No data sources attached
          </p>
        )}

        {dataSources.map((ds, index) => {
          const schema = providerSchemas.find((s) => s.name === ds.provider);
          return (
            <div
              key={`${ds.provider}-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/50"
              data-testid={`data-source-row-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-primary-500" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {schema?.label ?? ds.provider}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                  data-testid={`data-source-remove-${index}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Alias / id */}
              <div className="mt-2">
                <label className="mb-0.5 block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  Alias (used in expressions)
                </label>
                <input
                  type="text"
                  value={ds.id}
                  onChange={(e) => handleAliasChange(index, e.target.value)}
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-700 focus:border-primary-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  data-testid={`data-source-alias-${index}`}
                />
              </div>

              {/* Params */}
              {schema?.params?.map((paramSchema) => (
                <div key={paramSchema.name} className="mt-2">
                  <label className="mb-0.5 block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {paramSchema.label}
                  </label>
                  <input
                    type={paramSchema.type === "number" ? "number" : "text"}
                    value={
                      ds.params?.[paramSchema.name] != null
                        ? String(ds.params[paramSchema.name])
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed =
                        paramSchema.type === "number" && raw !== ""
                          ? Number(raw)
                          : raw;
                      handleParamChange(index, paramSchema.name, parsed);
                    }}
                    className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-primary-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    data-testid={`data-source-param-${index}-${paramSchema.name}`}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
