import { Hono } from "hono";
import {
  loginRequestSchema,
  type LoginRequest,
} from "@workspace/sdui-schema";
import type { AdminEnv } from "../middleware/admin-auth";
import { signJwt } from "../middleware/admin-auth";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/** Demo password for PoC (bypasses stored hash). */
const DEMO_PASSWORD = "admin123";

/** JWT secret for admin tokens (SDUI_JWT_SECRET env or dev default). */
// eslint-disable-next-line strict-env/no-process-env -- SDUI CMS uses its own env var
const JWT_SECRET = process.env["SDUI_JWT_SECRET"] ?? "sdui-dev-secret";

/**
 * Creates auth routes (login, me) with dependency-injected db.
 *
 * @param db - Prisma client (default from sduiPrismaClient when not provided).
 * @returns Hono app with POST /login and GET /me.
 */
export function createAuthRoutes(
  db: PrismaClient = sduiPrismaClient,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  /**
   * POST /login — validate email/password and return JWT.
   * For PoC, password is compared to hardcoded "admin123" for demo admin.
   */
  app.post("/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = loginRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
    }
    const { email, password } = parsed.data as LoginRequest;
    const admin = await db.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    // PoC: accept hardcoded demo password; ignore stored hash for simplicity.
    if (password !== DEMO_PASSWORD) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const token = signJwt(
      { adminId: admin.id, adminEmail: admin.email },
      JWT_SECRET,
    );
    return c.json({
      token,
      user: { id: admin.id, email: admin.email },
    });
  });

  /**
   * GET /me — return current admin from JWT (requires auth middleware upstream).
   */
  app.get("/me", async (c) => {
    const adminId = c.get("adminId");
    const adminEmail = c.get("adminEmail");
    return c.json({ id: adminId, email: adminEmail });
  });

  return app;
}
