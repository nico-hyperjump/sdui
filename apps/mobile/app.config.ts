import type { ExpoConfig } from "expo/config";

const BRAND = process.env.BRAND ?? "brand_a";

const brandAppNames: Record<string, string> = {
  brand_a: "Premium",
  brand_b: "Youth",
  brand_c: "Value",
  brand_demo: "Showcase",
};

const appName = brandAppNames[BRAND] ?? "Premium";
const slug = `xl-modula-${BRAND}`.replace(/_/g, "-");

/**
 * Dynamic Expo config. Reads BRAND env var (default "brand_a") and sets
 * app name, slug, and bundle identifiers. Configures expo-router and expo-updates.
 */
const config: ExpoConfig = {
  name: appName,
  slug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: slug,
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: `com.hyperjump.xlmodula.${BRAND.replace(/_/g, "")}`,
    supportsTablet: true,
  },
  android: {
    package: `com.hyperjump.xlmodula.${BRAND.replace(/_/g, "")}`,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-updates",
      {
        url: "https://updates.expo.dev/@your-username/" + slug,
      },
    ],
  ],
  newArchEnabled: true,
  experiments: {
    typedRoutes: true,
  },
  extra: {
    BRAND,
  },
};

export default config;
