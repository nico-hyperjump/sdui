import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { marketingDb } from "./db";
import { createOffersRoutes } from "./routes/offers";
import { createBannersRoutes } from "./routes/banners";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
    service: "marketing-source",
    timestamp: new Date().toISOString(),
  }),
);

app.route("/api/offers", createOffersRoutes(marketingDb));
app.route("/api/banners", createBannersRoutes(marketingDb));

const port = Number(process.env["PORT"] ?? 3002);

console.log(`Marketing Source starting on port ${port}`);
console.log(`  Offers API:  http://localhost:${port}/api/offers`);
console.log(`  Banners API: http://localhost:${port}/api/banners`);
console.log(`  Health:      http://localhost:${port}/health`);

serve({ fetch: app.fetch, port });
