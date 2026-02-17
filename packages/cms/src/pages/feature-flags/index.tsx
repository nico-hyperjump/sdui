import { useEffect, useState } from "react";
import type { FeatureFlag } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { Save } from "lucide-react";

const ROLLOUT_OPTIONS = [0, 50, 100];

/**
 * Feature flags page: table with Key, Description, Brand A/B/C toggles, Rollout %, Save per row.
 */
export function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const list = await apiClient.getFeatureFlags();
      setFlags(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(id: string, patch: Partial<FeatureFlag>) {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  async function handleSave(flag: FeatureFlag) {
    setSavingId(flag.id);
    try {
      await apiClient.updateFeatureFlag(flag.id, {
        key: flag.key,
        description: flag.description,
        brandA: flag.brandA,
        brandB: flag.brandB,
        brandC: flag.brandC,
        rolloutPercentage: flag.rolloutPercentage,
      });
      await load();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Feature Flags
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Toggle features per brand with rollout percentage controls
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : flags.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No feature flags configured.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Description
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand A
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand B
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand C
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rollout
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {flags.map((flag) => (
                <tr
                  key={flag.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {flag.key}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    {flag.description}
                  </td>
                  {(["brandA", "brandB", "brandC"] as const).map((brand) => (
                    <td key={brand} className="px-5 py-3.5 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={flag[brand]}
                        onClick={() =>
                          updateLocal(flag.id, { [brand]: !flag[brand] })
                        }
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 ${
                          flag[brand]
                            ? "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            flag[brand] ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <select
                        value={flag.rolloutPercentage}
                        onChange={(e) =>
                          updateLocal(flag.id, {
                            rolloutPercentage: Number(e.target.value),
                          })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {ROLLOUT_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}%
                          </option>
                        ))}
                      </select>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${flag.rolloutPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      disabled={savingId === flag.id}
                      onClick={() => handleSave(flag)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                      <Save className="h-3 w-3" />
                      {savingId === flag.id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
