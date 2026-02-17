import { z } from "zod";

// ---------------------------------------------------------------------------
// Feature flag definitions
// ---------------------------------------------------------------------------

/** Schema for a single feature flag. */
export const featureFlagSchema = z.object({
  id: z.string(),
  key: z.string(),
  description: z.string(),
  brandA: z.boolean(),
  brandB: z.boolean(),
  brandC: z.boolean(),
  rolloutPercentage: z.number().int().min(0).max(100),
});

/** A feature flag controlling functionality per brand with optional rollout. */
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

/** Schema for the request body when creating or updating a feature flag. */
export const featureFlagInputSchema = featureFlagSchema.omit({ id: true });

/** Input data for creating or updating a feature flag. */
export type FeatureFlagInput = z.infer<typeof featureFlagInputSchema>;

/** Schema for a partial update to a feature flag. */
export const featureFlagPatchSchema = featureFlagInputSchema.partial();

/** Partial update data for a feature flag. */
export type FeatureFlagPatch = z.infer<typeof featureFlagPatchSchema>;
