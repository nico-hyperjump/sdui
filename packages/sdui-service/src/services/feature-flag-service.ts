import { createHash } from "node:crypto";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/** Brand string to Prisma FeatureFlag column name. */
const BRAND_TO_COLUMN: Record<string, "brandA" | "brandB" | "brandC"> = {
  brand_a: "brandA",
  brand_b: "brandB",
  brand_c: "brandC",
};

/**
 * Returns a deterministic 0–100 bucket from a string (e.g. userId + flagKey).
 *
 * @param input - String to hash.
 * @returns Integer 0–99.
 */
function deterministicBucket(input: string): number {
  const hash = createHash("sha256").update(input).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  return num % 100;
}

/**
 * Evaluates all feature flags for a brand and optional user. For each flag,
 * checks the brand-specific toggle (brandA/brandB/brandC). If enabled, applies
 * rollout percentage using a deterministic hash of (userId + flagKey). Without
 * userId, rollout flags are false unless percentage is 100.
 *
 * @param brand - Brand identifier (e.g. "brand_a", "brand_b", "brand_c").
 * @param userId - Optional user ID for rollout; if missing, only 100% rollout flags are true.
 * @param db - Prisma client (default: sduiPrismaClient).
 * @returns Record of flag key to boolean.
 */
export async function evaluateFlags(
  brand: string,
  userId?: string,
  db: PrismaClient = sduiPrismaClient,
): Promise<Record<string, boolean>> {
  const flags = await db.featureFlag.findMany();
  const column = BRAND_TO_COLUMN[brand] ?? null;
  const result: Record<string, boolean> = {};

  for (const flag of flags) {
    const enabledForBrand = column ? (flag[column] as boolean) : false;
    if (!enabledForBrand) {
      result[flag.key] = false;
      continue;
    }
    const pct = flag.rolloutPercentage;
    if (pct >= 100) {
      result[flag.key] = true;
      continue;
    }
    if (userId == null || userId === "") {
      result[flag.key] = false;
      continue;
    }
    const bucket = deterministicBucket(`${userId}:${flag.key}`);
    result[flag.key] = bucket < pct;
  }

  return result;
}
