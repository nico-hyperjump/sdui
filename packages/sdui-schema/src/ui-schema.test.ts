import { describe, it, expect } from "vitest";
import {
  sduiActionSchema,
  sduiComponentSchema,
  sduiScreenSchema,
  sduiConditionSchema,
  sduiOverlaySchema,
  sduiOverlayStyleSchema,
  sduiOverlayTriggerSchema,
} from "./ui-schema";

describe("sduiActionSchema", () => {
  it("validates a navigate action", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "navigate",
      screen: "home",
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ type: "navigate", screen: "home" });
  });

  it("validates a webview action", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "webview",
      url: "https://example.com",
      title: "Terms",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a custom action", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "custom",
      name: "share",
      payload: { screen: "home" },
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an unknown action type", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "unknown_type",
      screen: "home",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects a webview action with an invalid URL", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "webview",
      url: "not-a-url",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("validates a show_overlay action", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "show_overlay",
      overlayId: "promo-modal",
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      type: "show_overlay",
      overlayId: "promo-modal",
    });
  });

  it("rejects a show_overlay action without overlayId", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "show_overlay",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("validates a dismiss_overlay action with overlayId", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "dismiss_overlay",
      overlayId: "promo-modal",
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      type: "dismiss_overlay",
      overlayId: "promo-modal",
    });
  });

  it("validates a dismiss_overlay action without overlayId", () => {
    // Act
    const result = sduiActionSchema.safeParse({
      type: "dismiss_overlay",
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ type: "dismiss_overlay" });
  });
});

describe("sduiConditionSchema", () => {
  it("validates a valid condition", () => {
    // Act
    const result = sduiConditionSchema.safeParse({
      field: "user_segment",
      operator: "eq",
      value: "postpaid",
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported operator", () => {
    // Act
    const result = sduiConditionSchema.safeParse({
      field: "user_segment",
      operator: "like",
      value: "post%",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("sduiComponentSchema", () => {
  it("validates a simple component", () => {
    // Act
    const result = sduiComponentSchema.safeParse({
      id: "text_1",
      type: "text",
      props: { content: "Hello" },
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: "text_1",
      type: "text",
      props: { content: "Hello" },
    });
  });

  it("validates a component with nested children", () => {
    // Setup
    const component = {
      id: "stack_1",
      type: "stack",
      children: [
        { id: "text_1", type: "text", props: { content: "Title" } },
        { id: "button_1", type: "button", props: { label: "Click me" } },
      ],
    };

    // Act
    const result = sduiComponentSchema.safeParse(component);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.children).toHaveLength(2);
  });

  it("validates a component with action and analytics", () => {
    // Act
    const result = sduiComponentSchema.safeParse({
      id: "card_1",
      type: "card",
      action: { type: "navigate", screen: "details" },
      analytics: { impression: "card_viewed", click: "card_tapped" },
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("validates a component with conditions", () => {
    // Act
    const result = sduiComponentSchema.safeParse({
      id: "banner_1",
      type: "hero_banner",
      conditions: [{ field: "user_segment", operator: "eq", value: "prepaid" }],
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects an unknown component type", () => {
    // Act
    const result = sduiComponentSchema.safeParse({
      id: "x",
      type: "magic_widget",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects a component without an id", () => {
    // Act
    const result = sduiComponentSchema.safeParse({
      type: "text",
    });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("sduiScreenSchema", () => {
  it("validates a complete screen", () => {
    // Setup
    const screen = {
      schemaVersion: "1.0",
      screenId: "home",
      brand: "brand_a",
      updatedAt: "2026-02-12T10:30:00Z",
      components: [
        { id: "hero_1", type: "hero_banner", props: { title: "Welcome" } },
      ],
    };

    // Act
    const result = sduiScreenSchema.safeParse(screen);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.screenId).toBe("home");
  });

  it("validates a screen with metadata", () => {
    // Act
    const result = sduiScreenSchema.safeParse({
      schemaVersion: "1.0",
      screenId: "plans",
      brand: "brand_b",
      updatedAt: "2026-02-12T10:30:00Z",
      components: [],
      metadata: { cacheKey: "plans_v2" },
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it("rejects a screen missing required fields", () => {
    // Act
    const result = sduiScreenSchema.safeParse({
      screenId: "home",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("validates a screen with overlays", () => {
    // Setup
    const screen = {
      schemaVersion: "1.0",
      screenId: "home",
      brand: "brand_a",
      updatedAt: "2026-02-17T10:00:00Z",
      components: [],
      overlays: [
        {
          id: "promo-modal",
          style: "modal",
          dismissible: true,
          trigger: { type: "manual" },
          components: [
            { id: "t1", type: "text", props: { content: "50% off!" } },
          ],
        },
      ],
    };

    // Act
    const result = sduiScreenSchema.safeParse(screen);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.overlays).toHaveLength(1);
    expect(result.data?.overlays?.[0]?.id).toBe("promo-modal");
  });
});

describe("sduiOverlayStyleSchema", () => {
  it("accepts modal style", () => {
    // Act
    const result = sduiOverlayStyleSchema.safeParse("modal");

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe("modal");
  });

  it("accepts bottom_sheet style", () => {
    // Act
    const result = sduiOverlayStyleSchema.safeParse("bottom_sheet");

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe("bottom_sheet");
  });

  it("accepts fullscreen style", () => {
    // Act
    const result = sduiOverlayStyleSchema.safeParse("fullscreen");

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe("fullscreen");
  });

  it("rejects an unknown style", () => {
    // Act
    const result = sduiOverlayStyleSchema.safeParse("popup");

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("sduiOverlayTriggerSchema", () => {
  it("accepts a manual trigger", () => {
    // Act
    const result = sduiOverlayTriggerSchema.safeParse({ type: "manual" });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ type: "manual" });
  });

  it("accepts an on_load trigger", () => {
    // Act
    const result = sduiOverlayTriggerSchema.safeParse({ type: "on_load" });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ type: "on_load" });
  });

  it("rejects an unknown trigger type", () => {
    // Act
    const result = sduiOverlayTriggerSchema.safeParse({ type: "on_scroll" });

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("sduiOverlaySchema", () => {
  it("validates a complete overlay", () => {
    // Setup
    const overlay = {
      id: "promo-modal",
      style: "modal",
      dismissible: true,
      trigger: { type: "manual" },
      components: [{ id: "t1", type: "text", props: { content: "Hello" } }],
    };

    // Act
    const result = sduiOverlaySchema.safeParse(overlay);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe("promo-modal");
    expect(result.data?.style).toBe("modal");
  });

  it("applies defaults for style, dismissible, and trigger", () => {
    // Setup
    const overlay = {
      id: "minimal",
      components: [],
    };

    // Act
    const result = sduiOverlaySchema.safeParse(overlay);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.style).toBe("modal");
    expect(result.data?.dismissible).toBe(true);
    expect(result.data?.trigger).toEqual({ type: "manual" });
  });

  it("validates a bottom_sheet overlay with on_load trigger", () => {
    // Setup
    const overlay = {
      id: "welcome-sheet",
      style: "bottom_sheet",
      dismissible: true,
      trigger: { type: "on_load" },
      dismissAfterMs: 5000,
      components: [{ id: "t1", type: "text", props: { content: "Welcome!" } }],
    };

    // Act
    const result = sduiOverlaySchema.safeParse(overlay);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.dismissAfterMs).toBe(5000);
    expect(result.data?.trigger).toEqual({ type: "on_load" });
  });

  it("validates a fullscreen overlay", () => {
    // Act
    const result = sduiOverlaySchema.safeParse({
      id: "fs-overlay",
      style: "fullscreen",
      components: [],
    });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.style).toBe("fullscreen");
  });

  it("rejects an overlay without an id", () => {
    // Act
    const result = sduiOverlaySchema.safeParse({
      components: [],
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects an overlay without components", () => {
    // Act
    const result = sduiOverlaySchema.safeParse({
      id: "no-content",
    });

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive dismissAfterMs", () => {
    // Act
    const result = sduiOverlaySchema.safeParse({
      id: "bad-timer",
      components: [],
      dismissAfterMs: 0,
    });

    // Assert
    expect(result.success).toBe(false);
  });
});
