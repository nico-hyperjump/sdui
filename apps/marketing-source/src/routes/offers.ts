import { Hono } from "hono";
import type { PrismaClient } from "../db";

/**
 * Creates CRUD routes for offers.
 *
 * @param db - Prisma client for the marketing database.
 * @returns Hono app with offer CRUD endpoints.
 */
export function createOffersRoutes(db: PrismaClient): Hono {
  const app = new Hono();

  /** GET /offers — list active offers, optional ?brand= and ?segment= filters. */
  app.get("/", async (c) => {
    const brand = c.req.query("brand");
    const segment = c.req.query("segment");
    const where: Record<string, unknown> = { active: true };
    if (brand) where["brand"] = brand;
    if (segment) where["segment"] = segment;

    const offers = await db.offer.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
    return c.json(offers);
  });

  /** GET /offers/:id — get a single offer. */
  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const offer = await db.offer.findUnique({ where: { id } });
    if (!offer) return c.json({ error: "Not found" }, 404);
    return c.json(offer);
  });

  /** POST /offers — create a new offer. */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const offer = await db.offer.create({ data: body });
    return c.json(offer, 201);
  });

  /** PUT /offers/:id — update an existing offer. */
  app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const existing = await db.offer.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    const offer = await db.offer.update({ where: { id }, data: body });
    return c.json(offer);
  });

  /** DELETE /offers/:id — delete an offer. */
  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const existing = await db.offer.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    await db.offer.delete({ where: { id } });
    return c.json({ ok: true });
  });

  return app;
}
