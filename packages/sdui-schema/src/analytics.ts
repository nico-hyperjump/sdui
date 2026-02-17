import { z } from "zod";

// ---------------------------------------------------------------------------
// Analytics events
// ---------------------------------------------------------------------------

/** Schema for the supported analytics event types. */
export const analyticsEventTypeSchema = z.enum([
  "screen_view",
  "button_click",
  "impression",
  "ab_variant_assigned",
  "custom",
]);

/** Supported analytics event type string. */
export type AnalyticsEventType = z.infer<typeof analyticsEventTypeSchema>;

/** Schema for an analytics event sent from the SDK. */
export const analyticsEventInputSchema = z.object({
  eventType: analyticsEventTypeSchema,
  brand: z.string(),
  userId: z.string().optional(),
  screenId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

/** An analytics event to be recorded. */
export type AnalyticsEventInput = z.infer<typeof analyticsEventInputSchema>;

/** Schema for a stored analytics event (includes server-assigned fields). */
export const analyticsEventSchema = analyticsEventInputSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

/** A persisted analytics event. */
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

// ---------------------------------------------------------------------------
// Analytics query results
// ---------------------------------------------------------------------------

/** Schema for an event count grouped by type. */
export const eventCountSchema = z.object({
  eventType: z.string(),
  count: z.number().int(),
});

/** Event count grouped by type. */
export type EventCount = z.infer<typeof eventCountSchema>;

/** Schema for the analytics summary returned by the CMS dashboard endpoint. */
export const analyticsSummarySchema = z.object({
  totalEvents: z.number().int(),
  countsByType: z.array(eventCountSchema),
  recentEvents: z.array(analyticsEventSchema),
});

/** Analytics summary for the CMS dashboard. */
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
