import { createHash } from "node:crypto";
import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";

/**
 * Deterministically selects an A/B test variant by hashing (userId + testId)
 * and mapping to percentage buckets. Variants are ordered; their percentages
 * define contiguous ranges (e.g. 50, 30, 20 → 0–49, 50–79, 80–99).
 *
 * @param testId - A/B test ID.
 * @param userId - User ID for stable assignment.
 * @param variants - Ordered list of variants with percentage (sum typically 100).
 * @returns The assigned variant name, or null if variants is empty.
 */
export function assignVariant(
  testId: string,
  userId: string,
  variants: { name: string; percentage: number }[],
): string | null {
  if (variants.length === 0) return null;
  const hash = createHash("sha256").update(`${userId}:${testId}`).digest("hex");
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  let acc = 0;
  for (const v of variants) {
    acc += v.percentage;
    if (bucket < acc) return v.name;
  }
  return variants[variants.length - 1]!.name;
}

/**
 * Finds the active A/B test for a screen and brand, including variants.
 *
 * @param screenId - Screen identifier.
 * @param brand - Brand identifier.
 * @param db - Prisma client (default: sduiPrismaClient).
 * @returns The active test with variants, or null.
 */
export async function getActiveTest(
  screenId: string,
  brand: string,
  db: PrismaClient = sduiPrismaClient,
): Promise<{ id: string; name: string; variants: { id: string; name: string; percentage: number; components: string }[] } | null> {
  const test = await db.abTest.findFirst({
    where: { screenId, brand, active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
  if (!test) return null;
  return {
    id: test.id,
    name: test.name,
    variants: test.variants.map((v) => ({
      id: v.id,
      name: v.name,
      percentage: v.percentage,
      components: v.components,
    })),
  };
}

/**
 * Assigns a variant for a user from an active test: computes deterministic
 * bucket (0–99) and maps it to the variant by percentage ranges.
 *
 * @param testId - A/B test ID.
 * @param userId - User ID.
 * @param variants - Ordered list of variants with percentage.
 * @returns The assigned variant name, or null if no variants.
 */
export function assignVariantFromRanges(
  testId: string,
  userId: string,
  variants: { name: string; percentage: number }[],
): string | null {
  if (variants.length === 0) return null;
  const hash = createHash("sha256").update(`${userId}:${testId}`).digest("hex");
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  let acc = 0;
  for (const v of variants) {
    acc += v.percentage;
    if (bucket < acc) return v.name;
  }
  return variants[variants.length - 1]!.name;
}
