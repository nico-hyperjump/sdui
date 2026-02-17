import type { BrandId } from "@workspace/sdui-schema";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";

/**
 * Props for {@link BrandFilter}.
 *
 * @property value – currently selected brand (`""` for "All").
 * @property onChange – called when the user picks a different brand.
 * @property showAll – when `true` an "All" option is rendered (defaults to `true`).
 */
export interface BrandFilterProps {
  value: BrandId | "";
  onChange: (brand: BrandId | "") => void;
  /** Show the "All" tab. Defaults to `true`. */
  showAll?: boolean;
}

/**
 * A consistent, tab-style brand filter/selector used across CMS pages.
 *
 * Renders pill-shaped tabs for each brand. When `showAll` is `true` (default)
 * an "All" tab is prepended so the user can clear the filter.
 *
 * @param props - {@link BrandFilterProps}
 */
export function BrandFilter({
  value,
  onChange,
  showAll = true,
}: BrandFilterProps) {
  const options: { id: BrandId | ""; label: string }[] = [
    ...(showAll ? [{ id: "" as const, label: "All" }] : []),
    ...BRAND_IDS.map((id) => ({ id, label: formatBrand(id) })),
  ];

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
      role="tablist"
      aria-label="Brand filter"
      data-testid="brand-filter"
    >
      {options.map(({ id, label }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
