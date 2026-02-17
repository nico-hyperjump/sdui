import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";
import type { DataProviderSchemaRegistry } from "@workspace/sdui-service";
import type { AdminEnv } from "./middleware/admin-auth";
import { adminAuthMiddleware } from "./middleware/admin-auth";
import { createAuthRoutes } from "./routes/auth";
import { createScreensRoutes } from "./routes/screens";
import { createFeatureFlagsRoutes } from "./routes/feature-flags";
import { createThemesRoutes } from "./routes/themes";
import { createAbTestsRoutes } from "./routes/ab-tests";
import { createAnalyticsRoutes } from "./routes/analytics";
import { createApiKeysRoutes } from "./routes/api-keys";
import { createProvidersRoutes } from "./routes/providers";

/**
 * Creates the SDUI CMS Hono app with auth, screens, feature-flags, themes,
 * ab-tests, analytics, api-keys, and providers routes. Auth routes are mounted
 * without JWT middleware; all other routes require admin JWT. Db is set on
 * context for all routes.
 *
 * @param options - Optional config; db defaults to sduiPrismaClient.
 * @returns Hono app configured for the CMS API.
 */
export function createSduiCmsService(
  options: {
    db?: PrismaClient;
    schemaRegistry?: DataProviderSchemaRegistry;
  } = {},
): Hono<AdminEnv> {
  const db = options.db ?? sduiPrismaClient;
  const app = new Hono<AdminEnv>();

  /** Set db in context for all routes. */
  app.use("*", async (c, next) => {
    c.set("db", db);
    await next();
  });

  /** Auth routes — no JWT required. */
  app.route("/auth", createAuthRoutes(db));

  /** Protected routes — require JWT. */
  const protectedApp = new Hono<AdminEnv>()
    .use("*", adminAuthMiddleware())
    .route("/screens", createScreensRoutes(db))
    .route("/feature-flags", createFeatureFlagsRoutes(db))
    .route("/themes", createThemesRoutes(db))
    .route("/ab-tests", createAbTestsRoutes(db))
    .route("/analytics", createAnalyticsRoutes(db))
    .route("/api-keys", createApiKeysRoutes(db))
    .route("/providers", createProvidersRoutes(options.schemaRegistry));

  app.route("/", protectedApp);

  return app;
}
