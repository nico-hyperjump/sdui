import { Hono } from "hono";
import type { PrismaClient } from "../db";

/**
 * Creates CRUD routes for user accounts.
 *
 * @param db - Prisma client for the account database.
 * @returns Hono app with account CRUD endpoints.
 */
export function createAccountsRoutes(db: PrismaClient): Hono {
  const app = new Hono();

  /** GET /accounts — list all accounts, optional ?brand= filter. */
  app.get("/", async (c) => {
    const brand = c.req.query("brand");
    const where: Record<string, unknown> = { active: true };
    if (brand) where["brand"] = brand;

    const accounts = await db.userAccount.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return c.json(accounts);
  });

  /** GET /accounts/:userId — get a single account by userId. */
  app.get("/:userId", async (c) => {
    const userId = c.req.param("userId");
    const account = await db.userAccount.findUnique({ where: { userId } });
    if (!account) return c.json({ error: "Not found" }, 404);
    return c.json(account);
  });

  /** POST /accounts — create a new account. */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const account = await db.userAccount.create({ data: body });
    return c.json(account, 201);
  });

  /** PUT /accounts/:userId — update an existing account. */
  app.put("/:userId", async (c) => {
    const userId = c.req.param("userId");
    const body = await c.req.json().catch(() => ({}));
    const existing = await db.userAccount.findUnique({ where: { userId } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    const account = await db.userAccount.update({
      where: { userId },
      data: body,
    });
    return c.json(account);
  });

  /** DELETE /accounts/:userId — delete an account. */
  app.delete("/:userId", async (c) => {
    const userId = c.req.param("userId");
    const existing = await db.userAccount.findUnique({ where: { userId } });
    if (!existing) return c.json({ error: "Not found" }, 404);
    await db.userAccount.delete({ where: { userId } });
    return c.json({ ok: true });
  });

  return app;
}
