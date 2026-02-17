import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  createSduiService,
  DataProviderRegistry,
  DataProviderSchemaRegistry,
  createMarketingProvider,
  createAccountProvider,
  marketingProviderSchema,
  accountProviderSchema,
} from "@workspace/sdui-service";
import { createSduiCmsService } from "@workspace/sdui-cms-service";
import { createSduiPrismaClient } from "@workspace/sdui-database";

const db = createSduiPrismaClient();

// Register data providers for server-side data resolution
const providerRegistry = new DataProviderRegistry();
providerRegistry.register("marketing", createMarketingProvider());
providerRegistry.register("account", createAccountProvider());

// Register provider schemas so the CMS can offer a data-binding picker
const schemaRegistry = new DataProviderSchemaRegistry();
schemaRegistry.register(marketingProviderSchema);
schemaRegistry.register(accountProviderSchema);

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  }),
);

// Health check
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// Public SDUI API -- SDK consumers authenticate with API key
app.route("/api/v1", createSduiService({ db, providerRegistry }));

// Admin CMS API -- CMS authenticates with admin JWT
app.route("/api/cms", createSduiCmsService({ db, schemaRegistry }));

// Start server
const port = Number(process.env["PORT"] ?? 3001);

console.log(`SDUI Server starting on port ${port}`);
console.log(`  Public API: http://localhost:${port}/api/v1`);
console.log(`  CMS API:    http://localhost:${port}/api/cms`);
console.log(`  Health:     http://localhost:${port}/health`);
console.log(`  Data providers: ${providerRegistry.names().join(", ")}`);

serve({ fetch: app.fetch, port });
