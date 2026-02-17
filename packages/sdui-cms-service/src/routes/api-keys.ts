import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { apiKeyInputSchema } from "@workspace/sdui-schema";
import type { AdminEnv } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient, hashApiKey } from "@workspace/sdui-database";

/** Prefix for masked key preview (e.g. "sk_...abc1"). */
const MASK_PREFIX = "sk_";
const MASK_SUFFIX_LEN = 4;

/**
 * Returns a masked preview of an API key (e.g. sk_****abc1).
 *
 * @param keyHash - Stored hash (we show last 4 chars of a placeholder for preview).
 * @returns Masked preview string.
 */
function maskKeyPreview(keyHash: string): string {
  const suffix = keyHash.slice(-MASK_SUFFIX_LEN);
  return `${MASK_PREFIX}****${suffix}`;
}

/**
 * Creates API key routes with dependency-injected db.
 *
 * @param db - Prisma client (default sduiPrismaClient).
 * @returns Hono app with GET/POST/DELETE api-keys.
 */
export function createApiKeysRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /api-keys — list all keys (masked preview). */
  app.get("/", async (c) => {
    const keys = await db.apiKey.findMany({
      orderBy: { createdAt: "desc" },
    });
    return c.json(
      keys.map((k) => ({
        id: k.id,
        label: k.label,
        keyPreview: maskKeyPreview(k.key),
        brand: k.brand,
        active: k.active,
        createdAt: k.createdAt.toISOString(),
      })),
    );
  });

  /**
   * POST /api-keys — create key (generate with crypto.randomUUID, store hashed,
   * return full key once).
   */
  app.post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = apiKeyInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation failed", issues: parsed.error.issues }, 400);
    }
    const { label, brand } = parsed.data;
    const rawKey = randomUUID();
    const keyHash = hashApiKey(rawKey);
    const apiKey = await db.apiKey.create({
      data: {
        key: keyHash,
        label,
        brand: brand ?? null,
        active: true,
      },
    });
    return c.json(
      {
        id: apiKey.id,
        key: rawKey,
        label: apiKey.label,
        brand: apiKey.brand,
      },
      201,
    );
  });

  /** DELETE /api-keys/:id — soft delete (set active=false). */
  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const existing = await db.apiKey.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: "Not found" }, 404);
    }
    await db.apiKey.update({
      where: { id },
      data: { active: false },
    });
    return c.json({ ok: true });
  });

  return app;
}
