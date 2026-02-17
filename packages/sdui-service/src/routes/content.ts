import { Hono } from "hono";
import type { PrismaClient } from "@workspace/sdui-database";
import type { GetOffersResponse, Offer } from "@workspace/sdui-schema";

/** Hono context variables for the SDUI service. */
type Env = { Variables: { apiKeyBrand: string | null; db: PrismaClient } };

const app = new Hono<Env>();

/** Hardcoded offers by segment; keys are prepaid, postpaid, business. */
const OFFERS_BY_SEGMENT: Record<string, Omit<Offer, "id">[]> = {
  prepaid: [
    { title: "Prepaid 5GB", description: "5GB data, 30 days", price: "$15", imageUrl: undefined, badge: "Popular", action: { type: "navigate", screen: "plan-detail" } },
    { title: "Prepaid 10GB", description: "10GB data, 30 days", price: "$25", imageUrl: undefined, badge: undefined, action: { type: "navigate", screen: "plan-detail" } },
  ],
  postpaid: [
    { title: "Unlimited Postpaid", description: "Unlimited data & talk", price: "$45/mo", imageUrl: undefined, badge: "Best value", action: { type: "navigate", screen: "plan-detail" } },
    { title: "Family 4 lines", description: "4 lines unlimited", price: "$120/mo", imageUrl: undefined, badge: undefined, action: { type: "navigate", screen: "plan-detail" } },
  ],
  business: [
    { title: "Business Pro", description: "Priority support, 50GB", price: "$75/mo", imageUrl: undefined, badge: "Business", action: { type: "navigate", screen: "plan-detail" } },
  ],
};

/** Default offers when segment is missing or unknown. */
const DEFAULT_OFFERS: Omit<Offer, "id">[] = OFFERS_BY_SEGMENT["prepaid"]!;

/**
 * GET /content/offers — returns offers for the given brand and user_segment.
 * Query: brand (required), user_segment (optional). Segment can be prepaid, postpaid, or business.
 * Returns brand-specific styling via a simple metadata field; offers are hardcoded by segment.
 */
app.get("/offers", async (c) => {
  const brand = c.req.query("brand") ?? "";
  const userSegment = (c.req.query("user_segment") ?? "prepaid").toLowerCase();

  const list = OFFERS_BY_SEGMENT[userSegment] ?? DEFAULT_OFFERS;
  const offers: Offer[] = list.map((o, i) => ({
    ...o,
    id: `offer-${brand}-${userSegment}-${i}`,
  }));

  const response: GetOffersResponse = { offers };
  return c.json(response);
});

export { app as contentRoutes };
