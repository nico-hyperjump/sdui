import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { accountDb } from "./db";
import { createAccountsRoutes } from "./routes/accounts";

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
    service: "account-source",
    timestamp: new Date().toISOString(),
  }),
);

app.route("/api/accounts", createAccountsRoutes(accountDb));

const port = Number(process.env["PORT"] ?? 3003);

console.log(`Account Source starting on port ${port}`);
console.log(`  Accounts API: http://localhost:${port}/api/accounts`);
console.log(`  Health:       http://localhost:${port}/health`);

serve({ fetch: app.fetch, port });
