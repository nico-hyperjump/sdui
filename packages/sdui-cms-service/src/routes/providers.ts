import { Hono } from "hono";
import type { AdminEnv } from "../middleware/admin-auth";
import type { DataProviderSchemaRegistry } from "@workspace/sdui-service";

/**
 * Creates provider catalog routes. Returns metadata about available data
 * providers so the CMS can offer a structured data-binding picker instead
 * of requiring admins to type raw `{{expression}}` strings.
 *
 * @param schemaRegistry - Registry of provider schemas (optional; returns empty array when absent).
 * @returns Hono app with GET /providers.
 */
export function createProvidersRoutes(
  schemaRegistry?: DataProviderSchemaRegistry,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /** GET /providers — return all registered provider schemas. */
  app.get("/", (c) => {
    const schemas = schemaRegistry?.getAll() ?? [];
    return c.json(schemas);
  });

  return app;
}
