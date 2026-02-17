import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import { postAnalyticsEventBodySchema } from "@workspace/sdui-schema";

/** Hono context variables for the SDUI service. */
type Env = { Variables: { apiKeyBrand: string | null; db: PrismaClient } };

const app = new Hono<Env>();

/**
 * POST /analytics/event — records an analytics event. Body is validated with
 * analyticsEventInputSchema. Returns 201 with { id }.
 */
app.post("/event", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = postAnalyticsEventBodySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid body", details: parsed.error.flatten() }, 400);
  }

  const { eventType, brand, userId, screenId, payload } = parsed.data;
  const db = c.get("db");

  const event = await db.analyticsEvent.create({
    data: {
      eventType,
      brand,
      userId: userId ?? null,
      screenId: screenId ?? null,
      payload: payload != null ? JSON.stringify(payload) : null,
    },
  });

  return c.json({ id: event.id }, 201);
});

export { app as analyticsRoutes };
