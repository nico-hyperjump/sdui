import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { createProvidersRoutes } from "./providers";
import type { DataProviderSchema } from "@workspace/sdui-schema";
import { DataProviderSchemaRegistry } from "@workspace/sdui-service";

/** Creates a minimal provider schema for testing. */
function createSchema(
  overrides?: Partial<DataProviderSchema>,
): DataProviderSchema {
  return {
    name: "test",
    label: "Test Provider",
    description: "A test provider",
    fields: [{ name: "value", label: "Value", type: "string" }],
    ...overrides,
  };
}

describe("GET /providers", () => {
  it("returns an empty array when no schema registry is provided", async () => {
    // Setup
    const app = new Hono().route("/providers", createProvidersRoutes());
    const req = new Request("http://localhost/providers");

    // Act
    const res = await app.request(req);
    const body = (await res.json()) as unknown[];

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns an empty array when the registry has no schemas", async () => {
    // Setup
    const registry = new DataProviderSchemaRegistry();
    const app = new Hono().route("/providers", createProvidersRoutes(registry));
    const req = new Request("http://localhost/providers");

    // Act
    const res = await app.request(req);
    const body = (await res.json()) as unknown[];

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns all registered provider schemas", async () => {
    // Setup
    const registry = new DataProviderSchemaRegistry();
    const account = createSchema({ name: "account", label: "Account" });
    const marketing = createSchema({ name: "marketing", label: "Marketing" });
    registry.register(account);
    registry.register(marketing);
    const app = new Hono().route("/providers", createProvidersRoutes(registry));
    const req = new Request("http://localhost/providers");

    // Act
    const res = await app.request(req);
    const body = (await res.json()) as DataProviderSchema[];

    // Assert
    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0]?.name).toBe("account");
    expect(body[1]?.name).toBe("marketing");
  });

  it("includes fields and params in the response", async () => {
    // Setup
    const registry = new DataProviderSchemaRegistry();
    registry.register(
      createSchema({
        name: "marketing",
        fields: [
          { name: "title", label: "Title", type: "string" },
          { name: "price", label: "Price", type: "number" },
        ],
        params: [
          {
            name: "limit",
            label: "Max Items",
            type: "number",
            defaultValue: 3,
          },
        ],
      }),
    );
    const app = new Hono().route("/providers", createProvidersRoutes(registry));
    const req = new Request("http://localhost/providers");

    // Act
    const res = await app.request(req);
    const body = (await res.json()) as DataProviderSchema[];

    // Assert
    expect(body[0]?.fields).toHaveLength(2);
    expect(body[0]?.fields[0]?.name).toBe("title");
    expect(body[0]?.params).toHaveLength(1);
    expect(body[0]?.params?.[0]?.name).toBe("limit");
  });
});
