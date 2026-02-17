import { Hono } from "hono";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Safely parses a value that may be a JSON string or already an object.
 *
 * @param value - A JSON string or already-parsed object.
 * @returns The parsed object, or an empty object on failure.
 */
function parseJsonField(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value ?? {};
}

/**
 * Serialises a theme row's JSON string fields into parsed objects for the API response.
 *
 * @param t - A theme database row.
 * @returns A plain object with parsed colors, typography, and assets.
 */
function serializeTheme(t: {
  id: string;
  brand: string;
  colors: string;
  typography: string;
  assets: string;
}) {
  return {
    id: t.id,
    brand: t.brand,
    colors: parseJsonField(t.colors),
    typography: parseJsonField(t.typography),
    assets: parseJsonField(t.assets),
  };
}

/**
 * Creates theme routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app with GET themes, GET themes/:brand, PATCH/PUT themes/:brand.
 */
export function createThemesRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /themes — return all themes as a record keyed by brand. */
  app.get("/", async (c) => {
    const themes = await db.theme.findMany({ orderBy: { brand: "asc" } });
    const record: Record<string, unknown> = {};
    for (const t of themes) {
      record[t.brand] = {
        colors: parseJsonField(t.colors),
        typography: parseJsonField(t.typography),
        assets: parseJsonField(t.assets),
      };
    }
    return c.json(record);
  });

  /** GET /themes/:brand — get theme by brand. */
  app.get("/:brand", async (c) => {
    const brand = c.req.param("brand");
    const theme = await db.theme.findUnique({ where: { brand } });
    if (!theme) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(serializeTheme(theme));
  });

  /**
   * Shared handler for PUT/PATCH /themes/:brand — upsert theme.
   *
   * @param c - Hono context.
   * @returns JSON response with the upserted theme.
   */
  async function upsertTheme(c: Parameters<Parameters<typeof app.put>[1]>[0]) {
    const brand = c.req.param("brand");
    const body = await c.req.json().catch(() => ({}));
    const colors =
      typeof body.colors === "string"
        ? body.colors
        : JSON.stringify(body.colors ?? "{}");
    const typography =
      typeof body.typography === "string"
        ? body.typography
        : JSON.stringify(body.typography ?? "{}");
    const assets =
      typeof body.assets === "string"
        ? body.assets
        : JSON.stringify(body.assets ?? "{}");

    const theme = await db.theme.upsert({
      where: { brand },
      create: { brand, colors, typography, assets },
      update: { colors, typography, assets },
    });
    return c.json(serializeTheme(theme));
  }

  /** PUT /themes/:brand — upsert theme (colors, typography, assets). */
  app.put("/:brand", upsertTheme);

  /** PATCH /themes/:brand — upsert theme (alias for PUT). */
  app.patch("/:brand", upsertTheme);

  return app;
}
