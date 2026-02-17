import { Hono } from "hono";
import { featureFlagPatchSchema } from "@workspace/sdui-schema";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Creates feature flag routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app with GET feature-flags and PATCH feature-flags/:id.
 */
export function createFeatureFlagsRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /feature-flags — list all flags. */
  app.get("/", async (c) => {
    const flags = await db.featureFlag.findMany({ orderBy: { key: "asc" } });
    return c.json(
      flags.map((f) => ({
        id: f.id,
        key: f.key,
        description: f.description,
        brandA: f.brandA,
        brandB: f.brandB,
        brandC: f.brandC,
        rolloutPercentage: f.rolloutPercentage,
      })),
    );
  });

  /** PATCH /feature-flags/:id — partial update (validated with featureFlagPatchSchema). */
  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const parsed = featureFlagPatchSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400);
    }
    const existing = await db.featureFlag.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: "Not found" }, 404);
    }
    const data = parsed.data;
    const flag = await db.featureFlag.update({
      where: { id },
      data: {
        ...(data.key != null && { key: data.key }),
        ...(data.description != null && { description: data.description }),
        ...(data.brandA !== undefined && { brandA: data.brandA }),
        ...(data.brandB !== undefined && { brandB: data.brandB }),
        ...(data.brandC !== undefined && { brandC: data.brandC }),
        ...(data.rolloutPercentage !== undefined && {
          rolloutPercentage: data.rolloutPercentage,
        }),
      },
    });
    return c.json({
      id: flag.id,
      key: flag.key,
      description: flag.description,
      brandA: flag.brandA,
      brandB: flag.brandB,
      brandC: flag.brandC,
      rolloutPercentage: flag.rolloutPercentage,
    });
  });

  return app;
}
