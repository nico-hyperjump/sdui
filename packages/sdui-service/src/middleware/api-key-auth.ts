import type { Context, Next } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient, hashApiKey } from "@workspace/sdui-database";

/** Hono context variables for API key auth: brand from key and optional db. */
export type ApiKeyAuthVariables = {
  apiKeyBrand: string | null;
  db: PrismaClient;
};

/**
 * Creates Hono middleware that authenticates requests using the X-API-Key header.
 * Hashes the key with SHA-256, looks it up in the ApiKey table, and attaches
 * apiKeyBrand and db to the context. Returns 401 if the key is missing, invalid, or inactive.
 *
 * @param db - Prisma client for ApiKey lookup (default: sduiPrismaClient).
 * @returns Hono middleware.
 */
export function createApiKeyAuthMiddleware(
  db: PrismaClient = sduiPrismaClient,
): (c: Context<{ Variables: ApiKeyAuthVariables }>, next: Next) => Promise<Response | void> {
  return async function apiKeyAuth(
    c: Context<{ Variables: ApiKeyAuthVariables }>,
    next: Next,
  ): Promise<Response | void> {
    const rawKey = c.req.header("X-API-Key");
    if (!rawKey || rawKey.trim() === "") {
      return c.json({ error: "Missing X-API-Key header" }, 401);
    }

    const keyHash = hashApiKey(rawKey.trim());
    const apiKey = await db.apiKey.findUnique({
      where: { key: keyHash },
    });

    if (!apiKey || !apiKey.active) {
      return c.json({ error: "Invalid or inactive API key" }, 401);
    }

    c.set("apiKeyBrand", apiKey.brand);
    c.set("db", db);
    return next();
  };
}
