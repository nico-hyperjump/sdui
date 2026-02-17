import { useSearchParams } from "react-router-dom";
import type { BrandId } from "@workspace/sdui-schema";
import { BRAND_IDS } from "@workspace/sdui-schema";

/** The URL search-param key used to persist the selected brand. */
const BRAND_PARAM = "brand";

/**
 * Result tuple from {@link useBrandFilter}.
 *
 * - `brand` – the currently selected brand (empty string means "all").
 * - `setBrand` – updates the selection and the URL search params.
 */
export type UseBrandFilterResult = readonly [
  brand: BrandId | "",
  setBrand: (value: BrandId | "") => void,
];

/**
 * Reads and writes the `?brand=` search parameter in the URL.
 *
 * If the current value is not a recognised {@link BrandId}, it falls back to
 * the empty string (meaning "all brands").
 *
 * @param deps - Optionally inject `useSearchParams` for testing.
 * @returns A `[brand, setBrand]` tuple.
 */
export function useBrandFilter(
  deps: {
    useSearchParams?: typeof useSearchParams;
  } = {},
): UseBrandFilterResult {
  const useSearchParamsFn = deps.useSearchParams ?? useSearchParams;
  const [searchParams, setSearchParams] = useSearchParamsFn();

  const raw = searchParams.get(BRAND_PARAM) ?? "";
  const brand: BrandId | "" = isBrandId(raw) ? raw : "";

  /**
   * Persists the selected brand in the URL search params.
   *
   * Setting to `""` removes the parameter entirely.
   */
  function setBrand(value: BrandId | "") {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(BRAND_PARAM, value);
        } else {
          next.delete(BRAND_PARAM);
        }
        return next;
      },
      { replace: true },
    );
  }

  return [brand, setBrand] as const;
}

/**
 * Type-guard that checks whether a string is a valid {@link BrandId}.
 *
 * @param value - The string to check.
 * @returns `true` if `value` is a member of {@link BRAND_IDS}.
 */
function isBrandId(value: string): value is BrandId {
  return (BRAND_IDS as readonly string[]).includes(value);
}
