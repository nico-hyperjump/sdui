import Constants from "expo-constants";
import type { BrandId } from "@workspace/sdui-schema";
import { BRANDS } from "@/constants/brands";

/** Default SDUI service base URL when not overridden. */
const DEFAULT_SERVICE_URL = "https://sdui.example.com";

/**
 * Resolved brand configuration for the app (brand id, name, API key, service URL).
 */
export interface BrandConfigResult {
  brandId: BrandId;
  name: string;
  apiKey: string;
  serviceUrl: string;
}

/**
 * Reads BRAND from expo-constants (manifest) or process.env, validates against
 * known brands, and returns brand id, name, API key, and service URL.
 * @returns Brand configuration for SduiProvider and app shell.
 */
export function getBrandConfig(): BrandConfigResult {
  const raw =
    (Constants.expoConfig?.extra?.BRAND as string | undefined) ??
    (Constants.manifest?.extra?.BRAND as string | undefined) ??
    (process.env.BRAND as string | undefined) ??
    "brand_a";

  const brandId = raw as BrandId;
  const meta = BRANDS[brandId];
  if (!meta) {
    const fallback: BrandId = "brand_a";
    const fallbackMeta = BRANDS[fallback];
    return {
      brandId: fallback,
      name: fallbackMeta.name,
      apiKey: fallbackMeta.apiKey,
      serviceUrl: DEFAULT_SERVICE_URL,
    };
  }

  const serviceUrl =
    (process.env.EXPO_PUBLIC_SDUI_SERVICE_URL as string | undefined) ??
    DEFAULT_SERVICE_URL;

  return {
    brandId,
    name: meta.name,
    apiKey: meta.apiKey,
    serviceUrl,
  };
}
