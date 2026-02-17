import { z } from "zod";

// ---------------------------------------------------------------------------
// Theme -- colors, typography, assets
// ---------------------------------------------------------------------------

/** Schema for a brand's color palette. */
export const themeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
});

/** A brand's color palette. */
export type ThemeColors = z.infer<typeof themeColorsSchema>;

/** Schema for a brand's typography settings. */
export const themeTypographySchema = z.object({
  fontFamily: z.string(),
  headingWeight: z.string(),
  bodyWeight: z.string(),
});

/** A brand's typography settings. */
export type ThemeTypography = z.infer<typeof themeTypographySchema>;

/** Schema for a brand's visual assets (logo, app icon). */
export const themeAssetsSchema = z.object({
  logo: z.string().url(),
  appIcon: z.string().url().optional(),
});

/** A brand's visual assets. */
export type ThemeAssets = z.infer<typeof themeAssetsSchema>;

/** Schema for a complete brand theme. */
export const brandThemeSchema = z.object({
  colors: themeColorsSchema,
  typography: themeTypographySchema,
  assets: themeAssetsSchema,
});

/** A complete brand theme (colors, typography, assets). */
export type BrandTheme = z.infer<typeof brandThemeSchema>;

// ---------------------------------------------------------------------------
// Brand IDs
// ---------------------------------------------------------------------------

/** Schema for the well-known brand identifiers. */
export const brandIdSchema = z.enum([
  "brand_a",
  "brand_b",
  "brand_c",
  "brand_demo",
]);

/** A brand identifier. */
export type BrandId = z.infer<typeof brandIdSchema>;

/** All known brand IDs derived from `brandIdSchema`. */
export const BRAND_IDS: readonly [BrandId, ...BrandId[]] =
  brandIdSchema.options;

/**
 * Formats a brand ID as a readable display label.
 * @param brand - The brand identifier (e.g. "brand_a").
 * @returns A formatted string (e.g. "Brand A").
 */
export function formatBrand(brand: string): string {
  return brand
    .replace("brand_", "Brand ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Full brand config returned by the config endpoint
// ---------------------------------------------------------------------------

/** Schema for the full brand configuration (theme + feature flags). */
export const brandConfigSchema = z.object({
  brandId: brandIdSchema,
  name: z.string(),
  theme: brandThemeSchema,
  featureFlags: z.record(z.string(), z.boolean()),
});

/** Full brand configuration returned by the `/config/:brand` endpoint. */
export type BrandConfig = z.infer<typeof brandConfigSchema>;
