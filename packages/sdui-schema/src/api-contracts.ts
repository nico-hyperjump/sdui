import { z } from "zod";
import { sduiScreenSchema } from "./ui-schema";
import { brandConfigSchema } from "./brand-config";
import { analyticsEventInputSchema, analyticsSummarySchema } from "./analytics";
import {
  featureFlagSchema,
  featureFlagInputSchema,
  featureFlagPatchSchema,
} from "./feature-flags";
import { abTestSchema, abTestInputSchema } from "./ab-test";

// ---------------------------------------------------------------------------
// Public API contracts (consumed by SDK via sdui-service)
// ---------------------------------------------------------------------------

/** Schema for query parameters on the screen endpoint. */
export const getScreenQuerySchema = z.object({
  brand: z.string(),
  user_segment: z.string().optional(),
  ab_test_group: z.string().optional(),
  user_id: z.string().optional(),
});

/** Query parameters for `GET /screens/:screenId`. */
export type GetScreenQuery = z.infer<typeof getScreenQuerySchema>;

/** Schema for the screen endpoint response. */
export const getScreenResponseSchema = sduiScreenSchema;

/** Response from `GET /screens/:screenId`. */
export type GetScreenResponse = z.infer<typeof getScreenResponseSchema>;

/** Schema for the brand config endpoint response. */
export const getConfigResponseSchema = brandConfigSchema;

/** Response from `GET /config/:brand`. */
export type GetConfigResponse = z.infer<typeof getConfigResponseSchema>;

/** Schema for query parameters on the offers endpoint. */
export const getOffersQuerySchema = z.object({
  brand: z.string(),
  user_segment: z.string().optional(),
});

/** Schema for a single offer item. */
export const offerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  imageUrl: z.string().optional(),
  badge: z.string().optional(),
  action: z
    .object({
      type: z.string(),
      screen: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
});

/** A personalized offer. */
export type Offer = z.infer<typeof offerSchema>;

/** Schema for the offers endpoint response. */
export const getOffersResponseSchema = z.object({
  offers: z.array(offerSchema),
});

/** Response from `GET /content/offers`. */
export type GetOffersResponse = z.infer<typeof getOffersResponseSchema>;

/** Schema for the analytics event POST body. */
export const postAnalyticsEventBodySchema = analyticsEventInputSchema;

// ---------------------------------------------------------------------------
// CMS API contracts (consumed by CMS frontend via sdui-cms-service)
// ---------------------------------------------------------------------------

/** Schema for admin login request body. */
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Admin login request body. */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Schema for admin login response. */
export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
  }),
});

/** Admin login response with JWT token. */
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// -- Screen CRUD --

/** Schema for a screen record as returned by the CMS API. */
export const screenRecordSchema = z.object({
  id: z.string(),
  screenId: z.string(),
  brand: z.string(),
  segment: z.string().nullable(),
  components: z.string(),
  overlays: z.string().nullable().optional(),
  dataSources: z.string().nullable().optional(),
  version: z.number().int(),
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** A screen record from the CMS API. */
export type ScreenRecord = z.infer<typeof screenRecordSchema>;

/** Schema for creating/updating a screen via CMS. */
export const screenInputSchema = z.object({
  screenId: z.string(),
  brand: z.string(),
  segment: z.string().nullable().optional(),
  components: z.string(),
  overlays: z.string().nullable().optional(),
  dataSources: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

/** Input for creating or updating a screen. */
export type ScreenInput = z.infer<typeof screenInputSchema>;

// -- Screen duplicate & copy-to-brands --

/** Schema for the request body of `POST /screens/:id/copy-to-brands`. */
export const copyToBrandsInputSchema = z.object({
  brands: z.array(z.string()).min(1),
});

/** Input for copying a screen to other brands. */
export type CopyToBrandsInput = z.infer<typeof copyToBrandsInputSchema>;

/** Schema describing a brand that was skipped during a copy-to-brands operation. */
export const skippedBrandSchema = z.object({
  brand: z.string(),
  reason: z.string(),
});

/** A brand that was skipped during copy-to-brands. */
export type SkippedBrand = z.infer<typeof skippedBrandSchema>;

/** Schema for the response of `POST /screens/:id/copy-to-brands`. */
export const copyToBrandsResponseSchema = z.object({
  created: z.array(screenRecordSchema),
  skipped: z.array(skippedBrandSchema),
});

/** Response from copying a screen to other brands. */
export type CopyToBrandsResponse = z.infer<typeof copyToBrandsResponseSchema>;

// -- Re-export shared schemas for CMS use --

export {
  featureFlagSchema,
  featureFlagInputSchema,
  featureFlagPatchSchema,
  abTestSchema,
  abTestInputSchema,
  analyticsSummarySchema,
};

// -- API key management --

/** Schema for a stored API key (key itself is masked). */
export const apiKeyRecordSchema = z.object({
  id: z.string(),
  label: z.string(),
  keyPreview: z.string(),
  brand: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
});

/** An API key record with masked key preview. */
export type ApiKeyRecord = z.infer<typeof apiKeyRecordSchema>;

/** Schema for creating a new API key. */
export const apiKeyInputSchema = z.object({
  label: z.string(),
  brand: z.string().nullable().optional(),
});

/** Input for creating a new API key. */
export type ApiKeyInput = z.infer<typeof apiKeyInputSchema>;

/** Schema for the response when creating an API key (includes full key once). */
export const apiKeyCreateResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  brand: z.string().nullable(),
});

/** Response from creating a new API key -- contains the full key (shown only once). */
export type ApiKeyCreateResponse = z.infer<typeof apiKeyCreateResponseSchema>;
