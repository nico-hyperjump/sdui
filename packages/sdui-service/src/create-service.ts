import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";
import type { ApiKeyAuthVariables } from "./middleware/api-key-auth";
import { createApiKeyAuthMiddleware } from "./middleware/api-key-auth";
import { createScreensRoutes } from "./routes/screens";
import { configRoutes } from "./routes/config";
import { contentRoutes } from "./routes/content";
import { analyticsRoutes } from "./routes/analytics";
import type { DataProviderRegistry } from "./services/data-provider-registry";

/** Options for creating the SDUI Hono app. */
export type CreateSduiServiceOptions = {
  /** Prisma client; defaults to sduiPrismaClient when omitted. */
  db?: PrismaClient;
  /** Optional data provider registry for server-side data resolution. */
  providerRegistry?: DataProviderRegistry;
};

/** Hono app environment with API key auth variables. */
type Env = { Variables: ApiKeyAuthVariables };

/**
 * Creates the Hono-based SDUI public API app. Applies API key authentication
 * to all routes and mounts screens, config, content, and analytics routes.
 * When a provider registry is supplied, screen responses include resolved
 * data from external sources.
 *
 * @param options - Optional db, providerRegistry.
 * @returns Configured Hono application.
 */
export function createSduiService(
  options: CreateSduiServiceOptions = {},
): Hono<Env> {
  const db = options.db ?? sduiPrismaClient;
  const app = new Hono<Env>();

  app.use("*", createApiKeyAuthMiddleware(db));

  app.route("/screens", createScreensRoutes(options.providerRegistry));
  app.route("/config", configRoutes);
  app.route("/content", contentRoutes);
  app.route("/analytics", analyticsRoutes);

  return app;
}
