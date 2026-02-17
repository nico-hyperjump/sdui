import { z } from "zod";
import { sduiComponentSchema } from "./ui-schema";

// ---------------------------------------------------------------------------
// A/B test variant
// ---------------------------------------------------------------------------

/** Schema for a single A/B test variant. */
export const abTestVariantSchema = z.object({
  id: z.string(),
  testId: z.string(),
  name: z.string(),
  percentage: z.number().int().min(0).max(100),
  components: z.array(sduiComponentSchema),
});

/** A single variant within an A/B test. */
export type AbTestVariant = z.infer<typeof abTestVariantSchema>;

/** Schema for creating/updating an A/B test variant. */
export const abTestVariantInputSchema = abTestVariantSchema.omit({
  id: true,
  testId: true,
});

/** Input data for creating or updating a variant. */
export type AbTestVariantInput = z.infer<typeof abTestVariantInputSchema>;

// ---------------------------------------------------------------------------
// A/B test
// ---------------------------------------------------------------------------

/** Schema for a complete A/B test configuration. */
export const abTestSchema = z.object({
  id: z.string(),
  name: z.string(),
  screenId: z.string(),
  brand: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  variants: z.array(abTestVariantSchema),
});

/** A complete A/B test configuration with its variants. */
export type AbTest = z.infer<typeof abTestSchema>;

/** Schema for creating a new A/B test. */
export const abTestInputSchema = z.object({
  name: z.string(),
  screenId: z.string(),
  brand: z.string(),
  variants: z.array(abTestVariantInputSchema),
});

/** Input data for creating a new A/B test. */
export type AbTestInput = z.infer<typeof abTestInputSchema>;
