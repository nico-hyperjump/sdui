import { useEffect, useState } from "react";
import type { BrandTheme } from "@workspace/sdui-schema";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import type { BrandId } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { useBrandFilter } from "@/hooks/use-brand-filter";
import { BrandFilter } from "@/components/brand-filter";
import { Save } from "lucide-react";

const BRANDS = BRAND_IDS.map((id: BrandId) => ({ id, label: formatBrand(id) }));

const FONT_OPTIONS = [
  "System",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
];

const WEIGHT_OPTIONS = ["300", "400", "500", "600", "700"];

const defaultTheme: BrandTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  },
  typography: {
    fontFamily: "System",
    headingWeight: "700",
    bodyWeight: "400",
  },
  assets: {
    logo: "https://example.com/logo.png",
    appIcon: "https://example.com/icon.png",
  },
};

/**
 * Theme config page: brand tabs, color/typography/logo inputs, swatch preview, Save.
 */
export function ThemesPage() {
  const [brandParam, setBrandParam] = useBrandFilter();
  const activeBrand: BrandId = brandParam || "brand_a";
  const setActiveBrand = (id: BrandId | "") => setBrandParam(id || "brand_a");
  const [themes, setThemes] = useState<Partial<Record<BrandId, BrandTheme>>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const theme = themes[activeBrand] ?? defaultTheme;

  async function load() {
    setLoading(true);
    try {
      const data = await apiClient.getThemes();
      setThemes(data);
    } catch {
      setThemes({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateTheme(patch: Partial<BrandTheme>) {
    setThemes((prev) => ({
      ...prev,
      [activeBrand]: {
        ...defaultTheme,
        ...prev[activeBrand],
        ...patch,
        colors: {
          ...defaultTheme.colors,
          ...prev[activeBrand]?.colors,
          ...patch.colors,
        },
        typography: {
          ...defaultTheme.typography,
          ...prev[activeBrand]?.typography,
          ...patch.typography,
        },
        assets: {
          ...defaultTheme.assets,
          ...prev[activeBrand]?.assets,
          ...patch.assets,
        },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.updateTheme(activeBrand, theme);
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Themes
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Customize brand colors, typography, and visual identity
        </p>
      </div>

      {/* Brand tabs */}
      <div className="mb-6">
        <BrandFilter
          value={activeBrand}
          onChange={setActiveBrand}
          showAll={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          {/* Colors */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Colors
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  "primary",
                  "secondary",
                  "accent",
                  "background",
                  "text",
                ] as const
              ).map((key) => (
                <div key={key}>
                  <label
                    htmlFor={`color-${key}`}
                    className="mb-1.5 block text-xs font-medium capitalize text-slate-500 dark:text-slate-400"
                  >
                    {key}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        id={`color-${key}`}
                        type="color"
                        value={theme.colors[key]}
                        onChange={(e) =>
                          updateTheme({
                            colors: { ...theme.colors, [key]: e.target.value },
                          })
                        }
                        className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 shadow-sm dark:border-slate-700"
                      />
                    </div>
                    <input
                      type="text"
                      value={theme.colors[key]}
                      onChange={(e) =>
                        updateTheme({
                          colors: { ...theme.colors, [key]: e.target.value },
                        })
                      }
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Typography
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fontFamily"
                  className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  Font family
                </label>
                <select
                  id="fontFamily"
                  value={theme.typography.fontFamily}
                  onChange={(e) =>
                    updateTheme({
                      typography: {
                        ...theme.typography,
                        fontFamily: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="headingWeight"
                    className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    Heading weight
                  </label>
                  <select
                    id="headingWeight"
                    value={theme.typography.headingWeight}
                    onChange={(e) =>
                      updateTheme({
                        typography: {
                          ...theme.typography,
                          headingWeight: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="bodyWeight"
                    className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    Body weight
                  </label>
                  <select
                    id="bodyWeight"
                    value={theme.typography.bodyWeight}
                    onChange={(e) =>
                      updateTheme({
                        typography: {
                          ...theme.typography,
                          bodyWeight: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Assets
            </h2>
            <div>
              <label
                htmlFor="logo"
                className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                Logo URL
              </label>
              <input
                id="logo"
                type="url"
                value={theme.assets.logo}
                onChange={(e) =>
                  updateTheme({
                    assets: { ...theme.assets, logo: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save theme"}
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Live Preview
            </h2>
            <div
              className="overflow-hidden rounded-lg border border-slate-100 p-6 dark:border-slate-800"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              }}
            >
              {/* Simulated app header */}
              <div
                className="mb-4 flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#fff",
                    fontWeight: Number(theme.typography.headingWeight),
                    fontFamily:
                      theme.typography.fontFamily === "System"
                        ? "inherit"
                        : theme.typography.fontFamily,
                  }}
                >
                  {BRANDS.find((b) => b.id === activeBrand)?.label} App
                </span>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>

              {/* Color swatches */}
              <div className="mb-4 grid grid-cols-5 gap-2">
                {(
                  [
                    "primary",
                    "secondary",
                    "accent",
                    "background",
                    "text",
                  ] as const
                ).map((key) => (
                  <div key={key} className="text-center">
                    <div
                      className="mx-auto mb-1 h-10 w-10 rounded-lg border border-slate-200/50 shadow-sm"
                      style={{ backgroundColor: theme.colors[key] }}
                    />
                    <span className="text-[10px] capitalize opacity-60">
                      {key}
                    </span>
                  </div>
                ))}
              </div>

              {/* Simulated card */}
              <div
                className="rounded-lg border px-4 py-3"
                style={{ borderColor: theme.colors.secondary + "30" }}
              >
                <p
                  className="mb-1 text-sm"
                  style={{
                    fontWeight: Number(theme.typography.headingWeight),
                    fontFamily:
                      theme.typography.fontFamily === "System"
                        ? "inherit"
                        : theme.typography.fontFamily,
                  }}
                >
                  Sample heading
                </p>
                <p
                  className="text-xs opacity-70"
                  style={{
                    fontWeight: Number(theme.typography.bodyWeight),
                    fontFamily:
                      theme.typography.fontFamily === "System"
                        ? "inherit"
                        : theme.typography.fontFamily,
                  }}
                >
                  This is body text rendered with the selected typography
                  settings.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-md px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
