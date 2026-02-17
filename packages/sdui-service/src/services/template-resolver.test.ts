import { describe, it, expect } from "vitest";
import type { SduiComponent } from "@workspace/sdui-schema";
import {
  resolvePath,
  interpolateValue,
  resolveTemplate,
} from "./template-resolver";

describe("resolvePath", () => {
  it("resolves a top-level key", () => {
    // Setup
    const data = { name: "Alice" };

    // Act
    const result = resolvePath(data, "name");

    // Assert
    expect(result).toBe("Alice");
  });

  it("resolves a nested dot-path", () => {
    // Setup
    const data = { account: { plan: { name: "Premium" } } };

    // Act
    const result = resolvePath(data, "account.plan.name");

    // Assert
    expect(result).toBe("Premium");
  });

  it("resolves array indices via numeric segments", () => {
    // Setup
    const data = { offers: [{ title: "First" }, { title: "Second" }] };

    // Act
    const result = resolvePath(data, "offers.1.title");

    // Assert
    expect(result).toBe("Second");
  });

  it("returns undefined for a missing path", () => {
    // Setup
    const data = { a: 1 };

    // Act
    const result = resolvePath(data, "b.c");

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns undefined when traversing through a null value", () => {
    // Setup
    const data = { a: null };

    // Act
    const result = resolvePath(data as Record<string, unknown>, "a.b");

    // Assert
    expect(result).toBeUndefined();
  });
});

describe("interpolateValue", () => {
  it("returns non-string values unchanged", () => {
    // Act
    const result = interpolateValue(42, {});

    // Assert
    expect(result).toBe(42);
  });

  it("preserves type for a single exact expression resolving to a number", () => {
    // Setup
    const data = { balance: { amount: 99000 } };

    // Act
    const result = interpolateValue("{{balance.amount}}", data);

    // Assert
    expect(result).toBe(99000);
  });

  it("preserves type for a single exact expression resolving to a boolean", () => {
    // Setup
    const data = { account: { active: true } };

    // Act
    const result = interpolateValue("{{account.active}}", data);

    // Assert
    expect(result).toBe(true);
  });

  it("replaces expressions in mixed text as strings", () => {
    // Setup
    const data = { user: { name: "Alice" }, balance: 500 };

    // Act
    const result = interpolateValue(
      "Hi {{user.name}}, balance: {{balance}}",
      data,
    );

    // Assert
    expect(result).toBe("Hi Alice, balance: 500");
  });

  it("returns empty string for missing data in a single expression", () => {
    // Act
    const result = interpolateValue("{{missing.path}}", {});

    // Assert
    expect(result).toBe("");
  });

  it("replaces missing expressions with empty string in mixed text", () => {
    // Act
    const result = interpolateValue("Hello {{name}}!", {});

    // Assert
    expect(result).toBe("Hello !");
  });

  it("returns plain strings without expressions unchanged", () => {
    // Act
    const result = interpolateValue("no expressions here", {});

    // Assert
    expect(result).toBe("no expressions here");
  });

  it("trims whitespace in expression paths", () => {
    // Setup
    const data = { name: "Bob" };

    // Act
    const result = interpolateValue("{{ name }}", data);

    // Assert
    expect(result).toBe("Bob");
  });
});

describe("resolveTemplate", () => {
  it("returns empty array for empty components", () => {
    // Act
    const result = resolveTemplate([], {});

    // Assert
    expect(result).toEqual([]);
  });

  it("interpolates props in a flat component", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "text-1",
        type: "text",
        props: { content: "Hello {{user.name}}" },
      },
    ];
    const dataMap = { user: { name: "Alice" } };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    expect(result).toEqual([
      {
        id: "text-1",
        type: "text",
        props: { content: "Hello Alice" },
      },
    ]);
  });

  it("preserves components without expressions", () => {
    // Setup
    const components: SduiComponent[] = [{ id: "spacer-1", type: "spacer" }];

    // Act
    const result = resolveTemplate(components, {});

    // Assert
    expect(result).toEqual([{ id: "spacer-1", type: "spacer" }]);
  });

  it("interpolates props in nested children", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "col-1",
        type: "column",
        children: [
          {
            id: "text-1",
            type: "text",
            props: { content: "{{greeting}}" },
          },
        ],
      },
    ];
    const dataMap = { greeting: "Welcome!" };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    expect(result[0]!.children![0]!.props!["content"]).toBe("Welcome!");
  });

  it("expands repeat directive into multiple components", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "card-tmpl",
        type: "product_card",
        repeat: { source: "offers", as: "offer" },
        props: {
          title: "{{offer.title}}",
          price: "{{offer.price}}",
        },
      },
    ];
    const dataMap = {
      offers: [
        { title: "Plan A", price: "$10" },
        { title: "Plan B", price: "$20" },
      ],
    };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "card-tmpl-0",
      type: "product_card",
      props: { title: "Plan A", price: "$10" },
    });
    expect(result[1]).toEqual({
      id: "card-tmpl-1",
      type: "product_card",
      props: { title: "Plan B", price: "$20" },
    });
  });

  it("returns empty array when repeat source is not an array", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "card-tmpl",
        type: "product_card",
        repeat: { source: "missing", as: "item" },
        props: { title: "{{item.name}}" },
      },
    ];

    // Act
    const result = resolveTemplate(components, {});

    // Assert
    expect(result).toEqual([]);
  });

  it("handles repeat inside a parent component's children", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "section",
        type: "column",
        children: [
          {
            id: "header",
            type: "text",
            props: { content: "Offers" },
          },
          {
            id: "offer-tmpl",
            type: "product_card",
            repeat: { source: "offers", as: "o" },
            props: { title: "{{o.title}}" },
          },
        ],
      },
    ];
    const dataMap = {
      offers: [{ title: "A" }, { title: "B" }],
    };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    const children = result[0]!.children!;
    expect(children).toHaveLength(3);
    expect(children[0]!.id).toBe("header");
    expect(children[1]!.id).toBe("offer-tmpl-0");
    expect(children[1]!.props!["title"]).toBe("A");
    expect(children[2]!.id).toBe("offer-tmpl-1");
    expect(children[2]!.props!["title"]).toBe("B");
  });

  it("preserves non-prop fields (action, analytics, conditions)", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "btn-1",
        type: "button",
        props: { label: "{{label}}" },
        action: { type: "navigate", screen: "detail" },
        analytics: { click: "btn_click" },
        conditions: [{ field: "segment", operator: "eq", value: "prepaid" }],
      },
    ];
    const dataMap = { label: "Go" };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    expect(result[0]!.props!["label"]).toBe("Go");
    expect(result[0]!.action).toEqual({ type: "navigate", screen: "detail" });
    expect(result[0]!.analytics).toEqual({ click: "btn_click" });
    expect(result[0]!.conditions).toEqual([
      { field: "segment", operator: "eq", value: "prepaid" },
    ]);
  });

  it("handles deeply nested repeat with child expressions", () => {
    // Setup
    const components: SduiComponent[] = [
      {
        id: "list-tmpl",
        type: "list_item",
        repeat: { source: "items", as: "item" },
        children: [
          {
            id: "label",
            type: "text",
            props: { content: "{{item.name}}" },
          },
        ],
      },
    ];
    const dataMap = {
      items: [{ name: "X" }, { name: "Y" }],
    };

    // Act
    const result = resolveTemplate(components, dataMap);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]!.children![0]!.props!["content"]).toBe("X");
    expect(result[1]!.children![0]!.props!["content"]).toBe("Y");
  });
});
