import { Hono } from "hono";
import { abTestInputSchema } from "@workspace/sdui-schema";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Creates A/B test routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app for ab-tests list, create, activate, deactivate, select-winner.
 */
export function createAbTestsRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /ab-tests — list all tests with variants. */
  app.get("/", async (c) => {
    const tests = await db.abTest.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
    return c.json(
      tests.map((t) => ({
        id: t.id,
        name: t.name,
        screenId: t.screenId,
        brand: t.brand,
        active: t.active,
        createdAt: t.createdAt.toISOString(),
        variants: t.variants.map((v) => ({
          id: v.id,
          testId: v.testId,
          name: v.name,
          percentage: v.percentage,
          components: v.components,
        })),
      })),
    );
  });

  /** POST /ab-tests — create test with variants (validated with abTestInputSchema). */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = abTestInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400);
    }
    const { name, screenId, brand, variants } = parsed.data;
    const test = await db.abTest.create({
      data: {
        name,
        screenId,
        brand,
        active: false,
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            percentage: v.percentage,
            components:
              typeof v.components === "string"
                ? v.components
                : JSON.stringify(v.components),
          })),
        },
      },
      include: { variants: true },
    });
    return c.json(
      {
        id: test.id,
        name: test.name,
        screenId: test.screenId,
        brand: test.brand,
        active: test.active,
        createdAt: test.createdAt.toISOString(),
        variants: test.variants.map((v) => ({
          id: v.id,
          testId: v.testId,
          name: v.name,
          percentage: v.percentage,
          components: v.components,
        })),
      },
      201,
    );
  });

  /** POST /ab-tests/:id/activate — set active=true. */
  app.post("/:id/activate", async (c) => {
    const id = c.req.param("id");
    const test = await db.abTest.findUnique({ where: { id } });
    if (!test) {
      return c.json({ error: "Not found" }, 404);
    }
    const updated = await db.abTest.update({
      where: { id },
      data: { active: true },
      include: { variants: true },
    });
    return c.json({
      id: updated.id,
      name: updated.name,
      screenId: updated.screenId,
      brand: updated.brand,
      active: updated.active,
      createdAt: updated.createdAt.toISOString(),
      variants: updated.variants.map((v) => ({
        id: v.id,
        testId: v.testId,
        name: v.name,
        percentage: v.percentage,
        components: v.components,
      })),
    });
  });

  /** POST /ab-tests/:id/deactivate — set active=false. */
  app.post("/:id/deactivate", async (c) => {
    const id = c.req.param("id");
    const test = await db.abTest.findUnique({ where: { id } });
    if (!test) {
      return c.json({ error: "Not found" }, 404);
    }
    const updated = await db.abTest.update({
      where: { id },
      data: { active: false },
      include: { variants: true },
    });
    return c.json({
      id: updated.id,
      name: updated.name,
      screenId: updated.screenId,
      brand: updated.brand,
      active: updated.active,
      createdAt: updated.createdAt.toISOString(),
      variants: updated.variants.map((v) => ({
        id: v.id,
        testId: v.testId,
        name: v.name,
        percentage: v.percentage,
        components: v.components,
      })),
    });
  });

  /**
   * POST /ab-tests/:id/select-winner — set winning variant's components on screen,
   * deactivate test.
   */
  app.post("/:id/select-winner", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const variantId = body?.variantId;
    if (typeof variantId !== "string") {
      return c.json({ error: "variantId required" }, 400);
    }
    const test = await db.abTest.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!test) {
      return c.json({ error: "Not found" }, 404);
    }
    const variant = test.variants.find((v) => v.id === variantId);
    if (!variant) {
      return c.json({ error: "Variant not found" }, 404);
    }
    await db.$transaction([
      db.screen.updateMany({
        where: { screenId: test.screenId, brand: test.brand },
        data: { components: variant.components },
      }),
      db.abTest.update({
        where: { id },
        data: { active: false },
      }),
    ]);
    const updated = await db.abTest.findUnique({
      where: { id },
      include: { variants: true },
    });
    return c.json({
      id: updated!.id,
      name: updated!.name,
      screenId: updated!.screenId,
      brand: updated!.brand,
      active: updated!.active,
      createdAt: updated!.createdAt.toISOString(),
      variants: updated!.variants.map((v) => ({
        id: v.id,
        testId: v.testId,
        name: v.name,
        percentage: v.percentage,
        components: v.components,
      })),
    });
  });

  return app;
}
