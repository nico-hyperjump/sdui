import { Hono } from "hono";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Creates analytics routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app with GET summary and GET ab-distribution/:testId.
 */
export function createAnalyticsRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /**
   * GET /analytics/summary — totalEvents, countsByType, recentEvents (last 100).
   */
  app.get("/summary", async (c) => {
    const [total, byType, recent] = await Promise.all([
      db.analyticsEvent.count(),
      db.analyticsEvent.groupBy({
        by: ["eventType"],
        _count: { eventType: true },
      }),
      db.analyticsEvent.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    const countsByType = byType.map((g) => ({
      eventType: g.eventType,
      count: g._count.eventType,
    }));
    const recentEvents = recent.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      brand: e.brand,
      userId: e.userId,
      screenId: e.screenId,
      payload: e.payload,
      createdAt: e.createdAt.toISOString(),
    }));
    return c.json({
      totalEvents: total,
      countsByType,
      recentEvents,
    });
  });

  /**
   * GET /analytics/ab-distribution/:testId — variant assignment counts for a test.
   */
  app.get("/ab-distribution/:testId", async (c) => {
    const testId = c.req.param("testId");
    const test = await db.abTest.findUnique({
      where: { id: testId },
      include: { variants: true },
    });
    if (!test) {
      return c.json({ error: "Not found" }, 404);
    }
    const variantIds = test.variants.map((v) => v.id);
    const events = await db.analyticsEvent.findMany({
      where: {
        eventType: "ab_variant_assigned",
        payload: { not: null },
      },
    });
    const distribution: Record<string, number> = {};
    for (const id of variantIds) {
      distribution[id] = 0;
    }
    for (const e of events) {
      let payload: { variantId?: string } | null = null;
      try {
        payload = e.payload ? (JSON.parse(e.payload) as { variantId?: string }) : null;
      } catch {
        // ignore malformed payload
      }
      const variantId = payload?.variantId;
      if (variantId && variantIds.includes(variantId)) {
        distribution[variantId] = (distribution[variantId] ?? 0) + 1;
      }
    }
    return c.json({
      testId,
      distribution: Object.entries(distribution).map(([variantId, count]) => ({
        variantId,
        count,
      })),
    });
  });

  return app;
}
