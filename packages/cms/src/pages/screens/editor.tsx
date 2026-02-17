import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type {
  ScreenInput,
  SduiComponent,
  SduiOverlay,
} from "@workspace/sdui-schema";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { ArrowLeft, Save, Code, Eye } from "lucide-react";
import { ScreenBuilder } from "@/components/screen-builder";
import { OverlayPanel } from "@/components/screen-builder/overlay-panel";

/**
 * Screen editor page with a visual drag-and-drop builder.
 * Includes form fields (screenId, brand, segment, published),
 * the ScreenBuilder component, and a collapsible JSON view.
 */
export function ScreenEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const [screenId, setScreenId] = useState("");
  const [brand, setBrand] = useState<string>(BRAND_IDS[0] ?? "brand_a");
  const [segment, setSegment] = useState("");
  const [published, setPublished] = useState(false);
  const [componentsJson, setComponentsJson] = useState("[]");
  const [overlays, setOverlays] = useState<SduiOverlay[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [availableScreenIds, setAvailableScreenIds] = useState<string[]>([]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const screen = await apiClient.getScreen(id!);
        if (cancelled) return;
        setScreenId(screen.screenId);
        setBrand(screen.brand);
        setSegment(screen.segment ?? "");
        setPublished(screen.published);
        setComponentsJson(screen.components);
        try {
          const parsed = screen.overlays
            ? (JSON.parse(screen.overlays) as SduiOverlay[])
            : [];
          setOverlays(Array.isArray(parsed) ? parsed : []);
        } catch {
          setOverlays([]);
        }
        setJsonError(null);
      } catch {
        if (!cancelled) setJsonError("Failed to load screen");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  // Fetch all screens so the navigate-action picker can list available screenIds.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const screens = await apiClient.getScreens();
        if (cancelled) return;
        const ids = [...new Set(screens.map((s) => s.screenId))].sort();
        setAvailableScreenIds(ids);
      } catch {
        /* non-critical — picker will just be empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Parses componentsJson safely into an SduiComponent array. */
  const parsedComponents: SduiComponent[] = useMemo(() => {
    try {
      const parsed = JSON.parse(componentsJson) as unknown;
      return Array.isArray(parsed) ? (parsed as SduiComponent[]) : [];
    } catch {
      return [];
    }
  }, [componentsJson]);

  /** Called by the ScreenBuilder when the component tree changes. */
  const handleComponentsChange = useCallback((components: SduiComponent[]) => {
    setComponentsJson(JSON.stringify(components));
    setJsonError(null);
  }, []);

  /** Validates and saves the screen. */
  async function handleSave() {
    let components: unknown[];
    try {
      const parsed = JSON.parse(componentsJson) as unknown;
      if (!Array.isArray(parsed)) {
        setJsonError("Components must be a JSON array");
        return;
      }
      components = parsed;
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      return;
    }

    const payload: ScreenInput = {
      screenId,
      brand,
      segment: segment.trim() || null,
      components: JSON.stringify(components),
      overlays: overlays.length > 0 ? JSON.stringify(overlays) : null,
      published,
    };
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.createScreen(payload);
        navigate("/screens", { replace: true });
      } else {
        await apiClient.updateScreen(id!, payload);
        setJsonError(null);
      }
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !isNew) {
    return (
      <div className="p-8">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/screens"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isNew ? "Create Screen" : "Edit Screen"}
          </h1>
          {!isNew && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Editing {screenId}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Screen metadata form */}
      <div className="mb-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="screenId"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Screen ID
            </label>
            <input
              id="screenId"
              type="text"
              value={screenId}
              onChange={(e) => setScreenId(e.target.value)}
              disabled={!isNew}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-800/50"
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Brand
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {BRAND_IDS.map((b) => (
                <option key={b} value={b}>
                  {formatBrand(b)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="segment"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Segment
              <span className="ml-1 text-xs font-normal text-slate-400">
                (optional)
              </span>
            </label>
            <input
              id="segment"
              type="text"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="e.g. premium"
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-3 pb-1">
              <button
                type="button"
                role="switch"
                aria-checked={published}
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 ${
                  published
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    published ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Published
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {jsonError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {jsonError}
        </div>
      )}

      {/* Screen Builder */}
      <ScreenBuilder
        value={parsedComponents}
        onChange={handleComponentsChange}
        screenIds={availableScreenIds}
      />

      {/* Overlay management */}
      <div className="mt-4">
        <OverlayPanel overlays={overlays} onChange={setOverlays} />
      </div>

      {/* Collapsible JSON view */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowJson(!showJson)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {showJson ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <Code className="h-3.5 w-3.5" />
          )}
          {showJson ? "Hide JSON" : "View JSON"}
        </button>

        {showJson && (
          <div className="mt-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <textarea
              value={(() => {
                try {
                  return JSON.stringify(JSON.parse(componentsJson), null, 2);
                } catch {
                  return componentsJson || "[]";
                }
              })()}
              onChange={(e) => {
                setComponentsJson(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setJsonError(null);
                } catch (err) {
                  setJsonError(
                    err instanceof Error ? err.message : "Invalid JSON",
                  );
                }
              }}
              rows={16}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}
