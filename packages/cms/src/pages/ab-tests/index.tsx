import { useEffect, useState } from "react";
import type {
  AbTest,
  AbTestInput,
  AbTestVariant,
  SduiComponent,
} from "@workspace/sdui-schema";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { Plus, X, Trophy, Play, Pause, Trash2 } from "lucide-react";

/**
 * A/B tests page: list with status, create form, activate/deactivate, select winner.
 */
export function AbTestsPage() {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createScreenId, setCreateScreenId] = useState("");
  const [createBrand, setCreateBrand] = useState(BRAND_IDS[0] ?? "brand_a");
  const [createVariants, setCreateVariants] = useState<
    { name: string; percentage: number; componentsJson: string }[]
  >([
    { name: "Control", percentage: 50, componentsJson: "[]" },
    { name: "Variant B", percentage: 50, componentsJson: "[]" },
  ]);
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [winnerTestId, setWinnerTestId] = useState<string | null>(null);
  const [winnerVariantId, setWinnerVariantId] = useState("");
  const [winnerSaving, setWinnerSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await apiClient.getAbTests();
      setTests(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleActivate(id: string) {
    setActionLoading(id);
    try {
      await apiClient.activateAbTest(id);
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeactivate(id: string) {
    setActionLoading(id);
    try {
      await apiClient.deactivateAbTest(id);
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  function addVariant() {
    setCreateVariants((prev) => [
      ...prev,
      { name: "", percentage: 0, componentsJson: "[]" },
    ]);
  }

  function removeVariant(i: number) {
    setCreateVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateSaving(true);
    try {
      const built: AbTestInput["variants"] = [];
      for (const v of createVariants) {
        let components: SduiComponent[];
        try {
          components = JSON.parse(v.componentsJson) as SduiComponent[];
        } catch {
          setCreateError("Invalid JSON in a variant");
          return;
        }
        built.push({ name: v.name, percentage: v.percentage, components });
      }
      await apiClient.createAbTest({
        name: createName,
        screenId: createScreenId,
        brand: createBrand,
        variants: built,
      });
      setShowCreate(false);
      setCreateName("");
      setCreateScreenId("");
      setCreateVariants([
        { name: "Control", percentage: 50, componentsJson: "[]" },
        { name: "Variant B", percentage: 50, componentsJson: "[]" },
      ]);
      await load();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreateSaving(false);
    }
  }

  async function handleSelectWinner() {
    if (!winnerTestId || !winnerVariantId) return;
    setWinnerSaving(true);
    try {
      await apiClient.selectWinner(winnerTestId, winnerVariantId);
      setWinnerTestId(null);
      setWinnerVariantId("");
      await load();
    } finally {
      setWinnerSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            A/B Tests
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Run experiments with variant allocation per screen
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          Create Test
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="animate-slide-up mb-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              New A/B Test
            </h2>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-5">
            {createError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
                {createError}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Screen ID
                </label>
                <input
                  type="text"
                  value={createScreenId}
                  onChange={(e) => setCreateScreenId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Brand
                </label>
                <select
                  value={createBrand}
                  onChange={(e) => setCreateBrand(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {BRAND_IDS.map((b) => (
                    <option key={b} value={b}>
                      {formatBrand(b)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Variants
                </span>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  <Plus className="h-3 w-3" />
                  Add variant
                </button>
              </div>
              <div className="space-y-3">
                {createVariants.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/30"
                  >
                    <input
                      type="text"
                      placeholder="Variant name"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...createVariants];
                        const cur = next[i];
                        if (!cur) return;
                        next[i] = {
                          name: e.target.value,
                          percentage: cur.percentage,
                          componentsJson: cur.componentsJson,
                        };
                        setCreateVariants(next);
                      }}
                      className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <select
                      value={v.percentage}
                      onChange={(e) => {
                        const next = [...createVariants];
                        const cur = next[i];
                        if (!cur) return;
                        next[i] = {
                          name: cur.name,
                          percentage: Number(e.target.value),
                          componentsJson: cur.componentsJson,
                        };
                        setCreateVariants(next);
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {[0, 25, 50, 75, 100].map((p) => (
                        <option key={p} value={p}>
                          {p}%
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="JSON components e.g. []"
                      value={v.componentsJson}
                      onChange={(e) => {
                        const next = [...createVariants];
                        const cur = next[i];
                        if (!cur) return;
                        next[i] = {
                          name: cur.name,
                          percentage: cur.percentage,
                          componentsJson: e.target.value,
                        };
                        setCreateVariants(next);
                      }}
                      className="min-w-[200px] flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {createSaving ? "Creating..." : "Create Test"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tests table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : tests.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No A/B tests. Create one to start experimenting.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Name
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Screen / Brand
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tests.map((test) => (
                <tr
                  key={test.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {test.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    <span className="text-slate-700 dark:text-slate-200">
                      {test.screenId}
                    </span>
                    <span className="mx-1.5 text-slate-300 dark:text-slate-600">
                      /
                    </span>
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {formatBrand(test.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {test.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {test.active ? (
                        <button
                          type="button"
                          disabled={actionLoading === test.id}
                          onClick={() => handleDeactivate(test.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                        >
                          <Pause className="h-3.5 w-3.5" />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading === test.id}
                          onClick={() => handleActivate(test.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Activate
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setWinnerTestId(test.id);
                          setWinnerVariantId(test.variants[0]?.id ?? "");
                        }}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                      >
                        <Trophy className="h-3.5 w-3.5" />
                        Select winner
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Select winner modal */}
      {winnerTestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-sm rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-1 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Select Winner
              </h2>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Choose the winning variant for this test.
            </p>
            <select
              value={winnerVariantId}
              onChange={(e) => setWinnerVariantId(e.target.value)}
              className="mb-5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {tests
                .find((t) => t.id === winnerTestId)
                ?.variants.map((v: AbTestVariant) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectWinner}
                disabled={winnerSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {winnerSaving ? "Saving..." : "Confirm Winner"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setWinnerTestId(null);
                  setWinnerVariantId("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
