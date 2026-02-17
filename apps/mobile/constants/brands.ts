import type { BrandId } from "@workspace/sdui-schema";

/**
 * Brand display name and default metadata for each supported brand.
 */
export interface BrandMeta {
  /** Display name. */
  name: string;
  /** Default primary color (hex). */
  primaryColor: string;
  /** Default accent color (hex). */
  accentColor: string;
  /** Demo API key for the brand. */
  apiKey: string;
}

/**
 * Mapping of brand IDs to display name, default colors, and demo API key.
 * Used when building without a config server (e.g. dev fallbacks).
 */
export const BRANDS: Record<BrandId, BrandMeta> = {
  brand_a: {
    name: "Premium",
    primaryColor: "#1a1a2e",
    accentColor: "#e94560",
    apiKey: "sk_brand_a_demo_key",
  },
  brand_b: {
    name: "Youth",
    primaryColor: "#16213e",
    accentColor: "#0f3460",
    apiKey: "sk_brand_b_demo_key",
  },
  brand_c: {
    name: "Value",
    primaryColor: "#0f0f23",
    accentColor: "#4ade80",
    apiKey: "sk_brand_c_demo_key",
  },
  brand_demo: {
    name: "Showcase",
    primaryColor: "#1B2838",
    accentColor: "#FF6B6B",
    apiKey: "sk_brand_demo_key",
  },
};
