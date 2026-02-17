import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import type { BrandConfig } from "@workspace/sdui-schema";
import { brandIdSchema } from "@workspace/sdui-schema";
import { evaluateFlags } from "../services/feature-flag-service";

/** Hono context variables for the SDUI service. */
type Env = { Variables: { apiKeyBrand: string | null; db: PrismaClient } };

const app = new Hono<Env>();

/** Maps URL brand param to display name. */
function brandDisplayName(brandId: string): string {
  const names: Record<string, string> = {
    brand_a: "Brand A",
    brand_b: "Brand B",
    brand_c: "Brand C",
  };
  return names[brandId] ?? brandId;
}

/**
 * GET /config/:brand — returns brand configuration: theme and evaluated feature flags.
 * Brand must be one of brand_a, brand_b, brand_c.
 */
app.get("/:brand", async (c) => {
  const brandParam = c.req.param("brand");
  const brandParsed = brandIdSchema.safeParse(brandParam);
  if (!brandParsed.success) {
    return c.json({ error: "Invalid brand" }, 400);
  }
  const brandId = brandParsed.data;
  const db = c.get("db");

  const themeRow = await db.theme.findUnique({
    where: { brand: brandId },
  });

  if (!themeRow) {
    return c.json({ error: "Theme not found for brand" }, 404);
  }

  let colors: BrandConfig["theme"]["colors"];
  let typography: BrandConfig["theme"]["typography"];
  let assets: BrandConfig["theme"]["assets"];
  try {
    colors = JSON.parse(themeRow.colors) as BrandConfig["theme"]["colors"];
    typography = JSON.parse(themeRow.typography) as BrandConfig["theme"]["typography"];
    assets = JSON.parse(themeRow.assets) as BrandConfig["theme"]["assets"];
  } catch {
    return c.json({ error: "Invalid theme data" }, 500);
  }

  const featureFlags = await evaluateFlags(brandId, undefined, db);

  const config: BrandConfig = {
    brandId,
    name: brandDisplayName(brandId),
    theme: { colors, typography, assets },
    featureFlags,
  };

  return c.json(config);
});

export { app as configRoutes };
