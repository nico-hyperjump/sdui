import { describe, it, expect } from "vitest";
import {
  analyticsEventInputSchema,
  analyticsEventSchema,
  analyticsSummarySchema,
  analyticsEventTypeSchema,
} from "./analytics";

describe("analyticsEventTypeSchema", () => {
  it("accepts screen_view", () => {
    // Act
    const result = analyticsEventTypeSchema.safeParse("screen_view");

    // Assert
    expect(result.success).toBe(true);
  });

  it("accepts button_click", () => {
    // Act
    const result = analyticsEventTypeSchema.safeParse("button_click");

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an unknown event type", () => {
    // Act
    const result = analyticsEventTypeSchema.safeParse("page_load");

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("analyticsEventInputSchema", () => {
  it("validates a minimal event", () => {
    // Act
    const result = analyticsEventInputSchema.safeParse({
      eventType: "screen_view",
      brand: "brand_a",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a complete event with all fields", () => {
    // Act
    const result = analyticsEventInputSchema.safeParse({
      eventType: "button_click",
      brand: "brand_b",
      userId: "user_123",
      screenId: "home",
      payload: { buttonId: "cta_1" },
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.userId).toBe("user_123");
  });

  it("rejects an event without brand", () => {
    // Act
    const result = analyticsEventInputSchema.safeParse({
      eventType: "screen_view",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("analyticsEventSchema", () => {
  it("validates a stored event with id and createdAt", () => {
    // Act
    const result = analyticsEventSchema.safeParse({
      id: "evt_1",
      eventType: "impression",
      brand: "brand_c",
      createdAt: "2026-02-12T10:30:00Z",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects a stored event missing id", () => {
    // Act
    const result = analyticsEventSchema.safeParse({
      eventType: "impression",
      brand: "brand_c",
      createdAt: "2026-02-12T10:30:00Z",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("analyticsSummarySchema", () => {
  it("validates a summary with counts and recent events", () => {
    // Act
    const result = analyticsSummarySchema.safeParse({
      totalEvents: 150,
      countsByType: [
        { eventType: "screen_view", count: 100 },
        { eventType: "button_click", count: 50 },
      ],
      recentEvents: [
        {
          id: "evt_1",
          eventType: "screen_view",
          brand: "brand_a",
          createdAt: "2026-02-12T10:30:00Z",
        },
      ],
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.totalEvents).toBe(150);
  });
});
