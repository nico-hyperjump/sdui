import { describe, it, expect } from "vitest";
import {
  brandIdSchema,
  brandConfigSchema,
  brandThemeSchema,
  themeColorsSchema,
  BRAND_IDS,
  formatBrand,
} from "./brand-config";

describe("brandIdSchema", () => {
  it("accepts brand_a", () => {
    // Act
    const result = brandIdSchema.safeParse("brand_a");

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe("brand_a");
  });

  it("accepts brand_b", () => {
    // Act
    const result = brandIdSchema.safeParse("brand_b");

    // Assert
    expect(result.success).toBe(true);
  });

  it("accepts brand_c", () => {
    // Act
    const result = brandIdSchema.safeParse("brand_c");

    // Assert
    expect(result.success).toBe(true);
  });

  it("accepts brand_demo", () => {
    // Act
    const result = brandIdSchema.safeParse("brand_demo");

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an unknown brand", () => {
    // Act
    const result = brandIdSchema.safeParse("brand_x");

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("BRAND_IDS", () => {
  it("contains every value from brandIdSchema", () => {
    // Assert
    expect(BRAND_IDS).toEqual(brandIdSchema.options);
  });

  it("includes brand_demo", () => {
    // Assert
    expect(BRAND_IDS).toContain("brand_demo");
  });
});

describe("formatBrand", () => {
  it("formats brand_a as 'Brand A'", () => {
    // Act & Assert
    expect(formatBrand("brand_a")).toBe("Brand A");
  });

  it("formats brand_demo as 'Brand Demo'", () => {
    // Act & Assert
    expect(formatBrand("brand_demo")).toBe("Brand Demo");
  });
});

describe("themeColorsSchema", () => {
  it("validates a complete color palette", () => {
    // Act
    const result = themeColorsSchema.safeParse({
      primary: "#003366",
      secondary: "#FFD700",
      accent: "#0066CC",
      background: "#FFFFFF",
      text: "#333333",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects a palette missing the primary color", () => {
    // Act
    const result = themeColorsSchema.safeParse({
      secondary: "#FFD700",
      accent: "#0066CC",
      background: "#FFFFFF",
      text: "#333333",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("brandThemeSchema", () => {
  it("validates a complete brand theme", () => {
    // Act
    const result = brandThemeSchema.safeParse({
      colors: {
        primary: "#003366",
        secondary: "#FFD700",
        accent: "#0066CC",
        background: "#FFFFFF",
        text: "#333333",
      },
      typography: {
        fontFamily: "Inter",
        headingWeight: "700",
        bodyWeight: "400",
      },
      assets: {
        logo: "https://example.com/logo.png",
      },
    });

    // Assert
    expect(result.success).toBe(true);
  });
});

describe("brandConfigSchema", () => {
  it("validates a full brand config with feature flags", () => {
    // Setup
    const config = {
      brandId: "brand_a",
      name: "Premium",
      theme: {
        colors: {
          primary: "#003366",
          secondary: "#FFD700",
          accent: "#0066CC",
          background: "#FFFFFF",
          text: "#333333",
        },
        typography: {
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: { logo: "https://example.com/logo.png" },
      },
      featureFlags: {
        esim_support: true,
        chat_support: false,
      },
    };

    // Act
    const result = brandConfigSchema.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.featureFlags.esim_support).toBe(true);
  });

  it("rejects config with invalid brand ID", () => {
    // Act
    const result = brandConfigSchema.safeParse({
      brandId: "unknown",
      name: "Unknown",
      theme: {
        colors: {
          primary: "#000",
          secondary: "#000",
          accent: "#000",
          background: "#000",
          text: "#000",
        },
        typography: {
          fontFamily: "Arial",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: { logo: "https://example.com/logo.png" },
      },
      featureFlags: {},
    });

    // Assert
    expect(result.success).toBe(false);
  });
});
