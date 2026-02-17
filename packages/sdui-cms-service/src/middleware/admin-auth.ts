import { createHmac } from "node:crypto";
import type { Context, Next } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";

/** Hono env with admin and db context variables. */
export type AdminEnv = {
  Variables: {
    adminId: string;
    adminEmail: string;
    db: PrismaClient;
  };
};

const JWT_HEADER_B64 = Buffer.from(
  JSON.stringify({ alg: "HS256", typ: "JWT" }),
  "utf8",
).toString("base64url");

/**
 * Encodes a string to base64url (base64 without +/=).
 *
 * @param input - Raw string to encode.
 * @returns Base64url-encoded string.
 */
function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

/**
 * Decodes a base64url string to UTF-8.
 *
 * @param input - Base64url string.
 * @returns Decoded UTF-8 string.
 */
function base64urlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  const padded = padding ? base64 + "=".repeat(4 - padding) : base64;
  return Buffer.from(padded, "base64").toString("utf8");
}

/**
 * JWT payload shape for admin tokens.
 */
export interface JwtPayload {
  adminId: string;
  adminEmail: string;
  iat?: number;
  exp?: number;
}

/**
 * Signs a JWT with HMAC-SHA256 using the given secret.
 *
 * @param payload - Payload object (adminId, adminEmail; iat/exp added automatically).
 * @param secret - Secret key for signing.
 * @param expiresInSeconds - Optional TTL in seconds (default 24h).
 * @returns Signed JWT string.
 */
export function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  secret: string,
  expiresInSeconds: number = 86400,
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const payloadB64 = base64urlEncode(JSON.stringify(fullPayload));
  const message = `${JWT_HEADER_B64}.${payloadB64}`;
  const sig = createHmac("sha256", secret).update(message).digest("base64url");
  return `${message}.${sig}`;
}

/**
 * Verifies a JWT and returns the payload if valid.
 *
 * @param token - Full JWT string (header.payload.signature).
 * @param secret - Secret key used to sign the token.
 * @returns Decoded payload or null if invalid/expired.
 */
export function verifyJwt(
  token: string,
  secret: string,
): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const headerB64 = parts[0];
  const payloadB64 = parts[1];
  const sigB64 = parts[2];
  if (!headerB64 || !payloadB64 || !sigB64) return null;
  const message = `${headerB64}.${payloadB64}`;
  const expectedSig = createHmac("sha256", secret).update(message).digest("base64url");
  if (sigB64 !== expectedSig) return null;
  try {
    const json = base64urlDecode(payloadB64);
    const payload = JSON.parse(json) as JwtPayload;
    if (payload.exp != null && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Hono middleware that verifies JWT from Authorization: Bearer <token>
 * and attaches adminId and adminEmail to context. Returns 401 JSON if invalid.
 *
 * @param secret - JWT secret (default from SDUI_JWT_SECRET or dev default).
 */
export function adminAuthMiddleware(
  // eslint-disable-next-line strict-env/no-process-env -- SDUI CMS uses its own env var
  secret: string = process.env["SDUI_JWT_SECRET"] ?? "sdui-dev-secret",
) {
  return async (c: Context<AdminEnv>, next: Next): Promise<Response | void> => {
    const auth = c.req.header("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const token = auth.slice(7).trim();
    const payload = verifyJwt(token, secret);
    if (!payload?.adminId || !payload?.adminEmail) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("adminId", payload.adminId);
    c.set("adminEmail", payload.adminEmail);
    await next();
  };
}
