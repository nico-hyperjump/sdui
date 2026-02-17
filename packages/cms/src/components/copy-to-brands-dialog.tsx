import { useEffect, useRef, useState } from "react";
import type {
  ScreenRecord,
  CopyToBrandsResponse,
} from "@workspace/sdui-schema";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { X, Check, AlertTriangle } from "lucide-react";

/** Props for the {@link CopyToBrandsDialog} component. */
export interface CopyToBrandsDialogProps {
  /** The source screen to copy from. */
  screen: ScreenRecord;
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog is dismissed. */
  onClose: () => void;
  /** Callback after a successful copy operation (to refresh the list). */
  onComplete: () => void;
  /** Optional API client override for testing. */
  copyFn?: (id: string, brands: string[]) => Promise<CopyToBrandsResponse>;
}

/**
 * Modal dialog that lets the user copy a screen to one or more other brands.
 * Displays brand checkboxes (with the source brand disabled), submits the
 * request, and shows results including any skipped brands.
 */
export function CopyToBrandsDialog({
  screen,
  open,
  onClose,
  onComplete,
  copyFn = (id, brands) => apiClient.copyScreenToBrands(id, brands),
}: CopyToBrandsDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopyToBrandsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setResult(null);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  /** Toggle a brand in the selection set. */
  function toggleBrand(brand: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  }

  /** Submit the copy-to-brands request. */
  async function handleSubmit() {
    if (selected.size === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await copyFn(screen.id, Array.from(selected));
      setResult(res);
      if (res.created.length > 0) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const otherBrands = BRAND_IDS.filter((b) => b !== screen.brand);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label="Copy to Other Brands"
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Copy to Other Brands
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {screen.screenId}
              </span>{" "}
              from {formatBrand(screen.brand)}
              {screen.segment ? ` (${screen.segment})` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Result view */}
        {result ? (
          <div>
            {result.created.length > 0 && (
              <div className="mb-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  Created {result.created.length} screen
                  {result.created.length > 1 ? "s" : ""}
                </div>
                <ul className="mt-1.5 space-y-0.5 pl-6 text-sm text-emerald-600 dark:text-emerald-400/80">
                  {result.created.map((s) => (
                    <li key={s.id}>
                      {formatBrand(s.brand)}
                      {s.screenId !== screen.screenId && (
                        <span className="ml-1 text-emerald-500 dark:text-emerald-500/70">
                          (as {s.screenId})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.skipped.length > 0 && (
              <div className="mb-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Skipped {result.skipped.length} brand
                  {result.skipped.length > 1 ? "s" : ""}
                </div>
                <ul className="mt-1.5 space-y-0.5 pl-6 text-sm text-amber-600 dark:text-amber-400/80">
                  {result.skipped.map((s) => (
                    <li key={s.brand}>
                      {formatBrand(s.brand)} &mdash;{" "}
                      {s.reason === "already_exists"
                        ? "already exists"
                        : s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Error */}
            {error && (
              <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Brand checkboxes */}
            {otherBrands.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                No other brands available.
              </p>
            ) : (
              <fieldset className="mb-5 space-y-2">
                <legend className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Select target brands
                </legend>
                {otherBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatBrand(brand)}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selected.size === 0 || loading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {loading
                  ? "Copying..."
                  : `Copy to ${selected.size} brand${selected.size !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
