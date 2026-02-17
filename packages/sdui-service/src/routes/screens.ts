import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import { getScreenQuerySchema } from "@workspace/sdui-schema";
import { resolveScreen } from "../services/screen-resolver";
import type { DataProviderRegistry } from "../services/data-provider-registry";

/** Hono context variables for the SDUI service. */
type Env = { Variables: { apiKeyBrand: string | null; db: PrismaClient } };

/**
 * Creates screen routes with an optional data provider registry for resolving
 * data sources declared on screens.
 *
 * @param providerRegistry - Optional registry of data providers.
 * @returns Hono app with GET /screens/:screenId.
 */
export function createScreensRoutes(
  providerRegistry?: DataProviderRegistry,
): Hono<Env> {
  const app = new Hono<Env>();

  /**
   * GET /screens/:screenId — returns the resolved SDUI screen for the given
   * brand, optional user_segment and user_id. Validates query with getScreenQuerySchema.
   * Returns 404 if the screen is not found.
   */
  app.get("/:screenId", async (c) => {
    const screenId = c.req.param("screenId");
    const query = c.req.query();
    const parsed = getScreenQuerySchema.safeParse({
      brand: query["brand"],
      user_segment: query["user_segment"],
      ab_test_group: query["ab_test_group"],
      user_id: query["user_id"],
    });

    if (!parsed.success) {
      return c.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        400,
      );
    }

    const { brand, user_segment, user_id } = parsed.data;
    const db = c.get("db");

    const screen = await resolveScreen({
      screenId,
      brand,
      segment: user_segment ?? null,
      userId: user_id ?? null,
      db,
      providerRegistry,
    });

    if (!screen) {
      return c.json({ error: "Screen not found" }, 404);
    }

    return c.json(screen);
  });

  return app;
}
