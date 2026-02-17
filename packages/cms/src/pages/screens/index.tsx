import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ScreenRecord } from "@workspace/sdui-schema";
import { formatBrand } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { useBrandFilter } from "@/hooks/use-brand-filter";
import { BrandFilter } from "@/components/brand-filter";
import { CopyToBrandsDialog } from "@/components/copy-to-brands-dialog";
import { Plus, Pencil, Globe, GlobeLock, Copy, Share2 } from "lucide-react";

/**
 * Screen list page with brand filter, table, and Create/Edit/Publish/Unpublish actions.
 */
export function ScreensIndexPage() {
  const [screens, setScreens] = useState<ScreenRecord[]>([]);
  const [brandFilter, setBrandFilter] = useBrandFilter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copyDialogScreen, setCopyDialogScreen] = useState<ScreenRecord | null>(
    null,
  );

  async function load() {
    setLoading(true);
    try {
      const list = await apiClient.getScreens(brandFilter || undefined);
      setScreens(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [brandFilter]);

  async function handlePublish(id: string) {
    setActionLoading(id);
    try {
      await apiClient.publishScreen(id);
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnpublish(id: string) {
    setActionLoading(id);
    try {
      await apiClient.unpublishScreen(id);
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  /** Duplicate a screen within the same brand. */
  async function handleDuplicate(id: string) {
    setActionLoading(id);
    try {
      await apiClient.duplicateScreen(id);
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Screens
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage SDUI screen configurations across brands
          </p>
        </div>
        <Link
          to="/screens/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          Create Screen
        </Link>
      </div>

      {/* Brand filter */}
      <div className="mb-5">
        <BrandFilter value={brandFilter} onChange={setBrandFilter} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : screens.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No screens found. Create one to get started.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Screen ID
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Segment
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Version
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {screens.map((s) => (
                <tr
                  key={s.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {s.screenId}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {formatBrand(s.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {s.segment ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {s.published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    v{s.version}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/screens/${s.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={actionLoading === s.id}
                        onClick={() => handleDuplicate(s.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => setCopyDialogScreen(s)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Copy to Brands
                      </button>
                      {s.published ? (
                        <button
                          type="button"
                          disabled={actionLoading === s.id}
                          onClick={() => handleUnpublish(s.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                        >
                          <GlobeLock className="h-3.5 w-3.5" />
                          Unpublish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading === s.id}
                          onClick={() => handlePublish(s.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Publish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Copy to Brands dialog */}
      {copyDialogScreen && (
        <CopyToBrandsDialog
          screen={copyDialogScreen}
          open={true}
          onClose={() => setCopyDialogScreen(null)}
          onComplete={() => load()}
        />
      )}
    </div>
  );
}
