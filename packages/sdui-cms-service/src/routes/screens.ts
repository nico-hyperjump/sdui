import { Hono } from "hono";
import {
  screenInputSchema,
  copyToBrandsInputSchema,
} from "@workspace/sdui-schema";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Maps a Prisma Screen row to the JSON shape returned by the CMS API.
 *
 * @param s - Prisma Screen record.
 * @returns Plain object matching ScreenRecord schema.
 */
function toScreenRecord(s: {
  id: string;
  screenId: string;
  brand: string;
  segment: string | null;
  components: string;
  overlays: string | null;
  dataSources: string | null;
  version: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: s.id,
    screenId: s.screenId,
    brand: s.brand,
    segment: s.segment,
    components: s.components,
    overlays: s.overlays,
    dataSources: s.dataSources,
    version: s.version,
    published: s.published,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

/**
 * Generates a unique screenId for a duplicate by appending a "-copy" suffix.
 * If "-copy" already exists, increments a numeric suffix ("-copy-2", "-copy-3", etc.).
 *
 * @param originalScreenId - The screenId of the source screen.
 * @param existingScreenIds - Set or array of screenIds already taken in the same brand+segment.
 * @returns A new screenId that does not collide with any existing ones.
 */
export function generateCopyScreenId(
  originalScreenId: string,
  existingScreenIds: ReadonlyArray<string> | ReadonlySet<string>,
): string {
  const taken =
    existingScreenIds instanceof Set
      ? existingScreenIds
      : new Set(existingScreenIds);

  const candidate = `${originalScreenId}-copy`;
  if (!taken.has(candidate)) return candidate;

  let n = 2;
  while (taken.has(`${originalScreenId}-copy-${n}`)) {
    n++;
  }
  return `${originalScreenId}-copy-${n}`;
}

/**
 * Creates screen CRUD routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app with GET/POST/PATCH screens and publish/unpublish, plus duplicate and copy-to-brands.
 */
export function createScreensRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /screens — list all screens, optional ?brand= filter. */
  app.get("/", async (c) => {
    const brand = c.req.query("brand");
    const where = brand ? { brand } : {};
    const screens = await db.screen.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
    return c.json(screens.map(toScreenRecord));
  });

  /** GET /screens/:id — get single screen by ID. */
  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const screen = await db.screen.findUnique({ where: { id } });
    if (!screen) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(toScreenRecord(screen));
  });

  /** POST /screens — create screen (validated with screenInputSchema). */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = screenInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Validation failed", issues: parsed.error.issues },
        400,
      );
    }
    const {
      screenId,
      brand,
      segment,
      components,
      overlays,
      dataSources,
      published,
    } = parsed.data;
    const screen = await db.screen.create({
      data: {
        screenId,
        brand,
        segment: segment ?? null,
        components,
        overlays: overlays ?? null,
        dataSources: dataSources ?? null,
        published: published ?? false,
      },
    });
    return c.json(toScreenRecord(screen), 201);
  });

  /** PATCH /screens/:id — update screen (partial). */
  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const parsed = screenInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Validation failed", issues: parsed.error.issues },
        400,
      );
    }
    const existing = await db.screen.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: "Not found" }, 404);
    }
    const data = parsed.data;
    const screen = await db.screen.update({
      where: { id },
      data: {
        ...(data.screenId != null && { screenId: data.screenId }),
        ...(data.brand != null && { brand: data.brand }),
        ...(data.segment !== undefined && { segment: data.segment ?? null }),
        ...(data.components != null && { components: data.components }),
        ...(data.overlays !== undefined && {
          overlays: data.overlays ?? null,
        }),
        ...(data.dataSources !== undefined && {
          dataSources: data.dataSources ?? null,
        }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
    return c.json(toScreenRecord(screen));
  });

  /** POST /screens/:id/publish — set published=true. */
  app.post("/:id/publish", async (c) => {
    const id = c.req.param("id");
    const screen = await db.screen.findUnique({ where: { id } });
    if (!screen) {
      return c.json({ error: "Not found" }, 404);
    }
    const updated = await db.screen.update({
      where: { id },
      data: { published: true },
    });
    return c.json(toScreenRecord(updated));
  });

  /** POST /screens/:id/unpublish — set published=false. */
  app.post("/:id/unpublish", async (c) => {
    const id = c.req.param("id");
    const screen = await db.screen.findUnique({ where: { id } });
    if (!screen) {
      return c.json({ error: "Not found" }, 404);
    }
    const updated = await db.screen.update({
      where: { id },
      data: { published: false },
    });
    return c.json(toScreenRecord(updated));
  });

  /** POST /screens/:id/duplicate — create a draft copy of the screen within the same brand. */
  app.post("/:id/duplicate", async (c) => {
    const id = c.req.param("id");
    const original = await db.screen.findUnique({ where: { id } });
    if (!original) {
      return c.json({ error: "Not found" }, 404);
    }

    const siblings = await db.screen.findMany({
      where: { brand: original.brand, segment: original.segment },
      select: { screenId: true },
    });
    const existingIds = siblings.map((s) => s.screenId);
    const newScreenId = generateCopyScreenId(original.screenId, existingIds);

    const created = await db.screen.create({
      data: {
        screenId: newScreenId,
        brand: original.brand,
        segment: original.segment,
        components: original.components,
        overlays: original.overlays,
        dataSources: original.dataSources,
        published: false,
      },
    });
    return c.json(toScreenRecord(created), 201);
  });

  /** POST /screens/:id/copy-to-brands — copy a screen to one or more target brands as drafts. */
  app.post("/:id/copy-to-brands", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const parsed = copyToBrandsInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Validation failed", issues: parsed.error.issues },
        400,
      );
    }

    const original = await db.screen.findUnique({ where: { id } });
    if (!original) {
      return c.json({ error: "Not found" }, 404);
    }

    const created: ReturnType<typeof toScreenRecord>[] = [];
    const skipped: { brand: string; reason: string }[] = [];

    for (const brand of parsed.data.brands) {
      if (brand === original.brand) {
        skipped.push({ brand, reason: "same_as_source" });
        continue;
      }

      const siblings = await db.screen.findMany({
        where: { brand, segment: original.segment },
        select: { screenId: true },
      });
      const existingIds = siblings.map((s) => s.screenId);
      const targetScreenId = existingIds.includes(original.screenId)
        ? generateCopyScreenId(original.screenId, existingIds)
        : original.screenId;

      const copy = await db.screen.create({
        data: {
          screenId: targetScreenId,
          brand,
          segment: original.segment,
          components: original.components,
          overlays: original.overlays,
          dataSources: original.dataSources,
          published: false,
        },
      });
      created.push(toScreenRecord(copy));
    }

    return c.json({ created, skipped }, 201);
  });

  return app;
}
