import { useEffect, useState } from "react";
import type {
  ApiKeyRecord,
  ApiKeyCreateResponse,
} from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { Plus, X, Copy, KeyRound, AlertTriangle } from "lucide-react";

/**
 * API key management: table (label, brand, status, preview), Create (dialog shows full key once), Revoke.
 */
export function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createLabel, setCreateLabel] = useState("");
  const [createBrand, setCreateBrand] = useState<string>("");
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<ApiKeyCreateResponse | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await apiClient.getApiKeys();
      setKeys(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreatedKey(null);
    setCreateSaving(true);
    try {
      const res = await apiClient.createApiKey({
        label: createLabel,
        brand: createBrand.trim() || null,
      });
      setCreatedKey(res);
      setCreateLabel("");
      setCreateBrand("");
      await load();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreateSaving(false);
    }
  }

  function closeCreate() {
    setShowCreate(false);
    setCreatedKey(null);
    setCreateError(null);
    setCopied(false);
  }

  /**
   * Copies the created API key to the clipboard.
   */
  async function handleCopy() {
    if (!createdKey) return;
    await navigator.clipboard.writeText(createdKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke(id: string) {
    setRevokingId(id);
    try {
      await apiClient.deleteApiKey(id);
      await load();
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            API Keys
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage access credentials for SDK integrations
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          Create Key
        </button>
      </div>

      {/* Keys table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : keys.length === 0 ? (
          <div className="p-12 text-center">
            <KeyRound className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-400">
              No API keys. Create one to get started.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Label
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Preview
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {k.label}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {k.brand ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {k.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {k.keyPreview}
                    </code>
                  </td>
                  <td className="px-5 py-3.5">
                    {k.active && (
                      <button
                        type="button"
                        disabled={revokingId === k.id}
                        onClick={() => handleRevoke(k.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        {revokingId === k.id ? "Revoking..." : "Revoke"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/show-key modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {createdKey ? "Key Created" : "Create API Key"}
              </h2>
              <button
                type="button"
                onClick={closeCreate}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {createdKey ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/20">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Copy this key now. It won&apos;t be shown again.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs break-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    {createdKey.key}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg border border-slate-300 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Copied to clipboard
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Label: {createdKey.label}
                  {createdKey.brand != null
                    ? ` · Brand: ${createdKey.brand}`
                    : ""}
                </p>
                <button
                  type="button"
                  onClick={closeCreate}
                  className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-5">
                {createError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
                    {createError}
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Label
                  </label>
                  <input
                    type="text"
                    value={createLabel}
                    onChange={(e) => setCreateLabel(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="e.g. Production key"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Brand
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={createBrand}
                    onChange={(e) => setCreateBrand(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="brand_a"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={createSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    {createSaving ? "Creating..." : "Create Key"}
                  </button>
                  <button
                    type="button"
                    onClick={closeCreate}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
