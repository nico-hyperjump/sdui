import { Hono } from "hono";
import type { PrismaClient } from "../db";

/**
 * Creates CRUD routes for banners.
 *
 * @param db - Prisma client for the marketing database.
 * @returns Hono app with banner CRUD endpoints.
 */
export function createBannersRoutes(db: PrismaClient): Hono {
  const app = new Hono();

  /** GET /banners — list active banners, optional ?brand= and ?segment= filters. */
  app.get("/", async (c) => {
    const brand = c.req.query("brand");
    const segment = c.req.query("segment");
    const where: Record<string, unknown> = { active: true };
    if (brand) where["brand"] = brand;
    if (segment) where["segment"] = segment;

    const banners = await db.banner.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
    return c.json(banners);
  });

  /** GET /banners/:id — get a single banner. */
  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const banner = await db.banner.findUnique({ where: { id } });
    if (!banner) return c.json({ error: "Not found" }, 404);
    return c.json(banner);
  });

  /** POST /banners — create a new banner. */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const banner = await db.banner.create({ data: body });
    return c.json(banner, 201);
  });

  /** PUT /banners/:id — update an existing banner. */
  app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const existing = await db.banner.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    const banner = await db.banner.update({ where: { id }, data: body });
    return c.json(banner);
  });

  /** DELETE /banners/:id — delete a banner. */
  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const existing = await db.banner.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    await db.banner.delete({ where: { id } });
    return c.json({ ok: true });
  });

  return app;
}
