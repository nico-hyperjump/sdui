import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type {
  SduiDataSource,
  DataProviderSchema,
} from "@workspace/sdui-schema";
import { DataSourcePanel } from "./data-source-panel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Creates a minimal provider schema for testing. */
function createSchema(
  overrides?: Partial<DataProviderSchema>,
): DataProviderSchema {
  return {
    name: "account",
    label: "Account Data",
    description: "User account info",
    fields: [{ name: "name", label: "Name", type: "string" }],
    ...overrides,
  };
}

/** Creates a minimal data source for testing. */
function createDataSource(overrides?: Partial<SduiDataSource>): SduiDataSource {
  return {
    id: "account",
    provider: "account",
    ...overrides,
  };
}

describe("DataSourcePanel", () => {
  it("renders empty state when no data sources are attached", () => {
    // Act
    render(
      <DataSourcePanel
        dataSources={[]}
        onChange={vi.fn()}
        providerSchemas={[createSchema()]}
      />,
    );

    // Assert
    expect(screen.getByTestId("data-source-empty")).toBeDefined();
  });

  it("renders a row for each data source", () => {
    // Setup
    const dataSources = [
      createDataSource({ id: "account", provider: "account" }),
      createDataSource({ id: "offers", provider: "marketing" }),
    ];
    const schemas = [
      createSchema({ name: "account", label: "Account Data" }),
      createSchema({ name: "marketing", label: "Marketing Offers" }),
    ];

    // Act
    render(
      <DataSourcePanel
        dataSources={dataSources}
        onChange={vi.fn()}
        providerSchemas={schemas}
      />,
    );

    // Assert
    expect(screen.getByTestId("data-source-row-0")).toBeDefined();
    expect(screen.getByTestId("data-source-row-1")).toBeDefined();
  });

  it("shows provider label in each data source row", () => {
    // Setup
    const dataSources = [createDataSource()];
    const schemas = [createSchema({ name: "account", label: "Account Data" })];

    // Act
    render(
      <DataSourcePanel
        dataSources={dataSources}
        onChange={vi.fn()}
        providerSchemas={schemas}
      />,
    );

    // Assert
    expect(screen.getByTestId("data-source-row-0").textContent).toContain(
      "Account Data",
    );
  });

  it("calls onChange with the new data source when added", () => {
    // Setup
    const onChange = vi.fn();
    const schemas = [
      createSchema({ name: "account", label: "Account Data" }),
      createSchema({ name: "marketing", label: "Marketing Offers" }),
    ];

    render(
      <DataSourcePanel
        dataSources={[createDataSource()]}
        onChange={onChange}
        providerSchemas={schemas}
      />,
    );

    // Act
    fireEvent.change(screen.getByTestId("add-data-source-select"), {
      target: { value: "marketing" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith([
      { id: "account", provider: "account" },
      { id: "marketing", provider: "marketing" },
    ]);
  });

  it("includes default params when adding a source with param defaults", () => {
    // Setup
    const onChange = vi.fn();
    const schemas = [
      createSchema({
        name: "marketing",
        label: "Marketing",
        params: [
          { name: "limit", label: "Limit", type: "number", defaultValue: 3 },
        ],
      }),
    ];

    render(
      <DataSourcePanel
        dataSources={[]}
        onChange={onChange}
        providerSchemas={schemas}
      />,
    );

    // Act
    fireEvent.change(screen.getByTestId("add-data-source-select"), {
      target: { value: "marketing" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith([
      { id: "marketing", provider: "marketing", params: { limit: 3 } },
    ]);
  });

  it("calls onChange without the removed data source", () => {
    // Setup
    const onChange = vi.fn();
    const dataSources = [
      createDataSource({ id: "account", provider: "account" }),
      createDataSource({ id: "offers", provider: "marketing" }),
    ];

    render(
      <DataSourcePanel
        dataSources={dataSources}
        onChange={onChange}
        providerSchemas={[
          createSchema({ name: "account" }),
          createSchema({ name: "marketing" }),
        ]}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("data-source-remove-0"));

    // Assert
    expect(onChange).toHaveBeenCalledWith([
      { id: "offers", provider: "marketing" },
    ]);
  });

  it("updates alias when the alias input changes", () => {
    // Setup
    const onChange = vi.fn();
    render(
      <DataSourcePanel
        dataSources={[createDataSource()]}
        onChange={onChange}
        providerSchemas={[createSchema()]}
      />,
    );

    // Act
    fireEvent.change(screen.getByTestId("data-source-alias-0"), {
      target: { value: "myAccount" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith([
      { id: "myAccount", provider: "account" },
    ]);
  });

  it("renders param inputs for providers that accept params", () => {
    // Setup
    const schemas = [
      createSchema({
        name: "marketing",
        params: [{ name: "limit", label: "Max Items", type: "number" }],
      }),
    ];

    // Act
    render(
      <DataSourcePanel
        dataSources={[
          createDataSource({
            id: "offers",
            provider: "marketing",
            params: { limit: 5 },
          }),
        ]}
        onChange={vi.fn()}
        providerSchemas={schemas}
      />,
    );

    // Assert
    const input = screen.getByTestId(
      "data-source-param-0-limit",
    ) as HTMLInputElement;
    expect(input.value).toBe("5");
  });

  it("updates param value when param input changes", () => {
    // Setup
    const onChange = vi.fn();
    const schemas = [
      createSchema({
        name: "marketing",
        params: [{ name: "limit", label: "Max Items", type: "number" }],
      }),
    ];

    render(
      <DataSourcePanel
        dataSources={[
          createDataSource({
            id: "offers",
            provider: "marketing",
            params: { limit: 3 },
          }),
        ]}
        onChange={onChange}
        providerSchemas={schemas}
      />,
    );

    // Act
    fireEvent.change(screen.getByTestId("data-source-param-0-limit"), {
      target: { value: "10" },
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith([
      { id: "offers", provider: "marketing", params: { limit: 10 } },
    ]);
  });

  it("hides the add dropdown when all providers are already used", () => {
    // Setup
    const schemas = [createSchema({ name: "account" })];

    // Act
    render(
      <DataSourcePanel
        dataSources={[createDataSource()]}
        onChange={vi.fn()}
        providerSchemas={schemas}
      />,
    );

    // Assert
    expect(screen.queryByTestId("add-data-source-select")).toBeNull();
  });

  it("falls back to provider name when schema is not found", () => {
    // Act
    render(
      <DataSourcePanel
        dataSources={[createDataSource({ id: "custom", provider: "custom" })]}
        onChange={vi.fn()}
        providerSchemas={[]}
      />,
    );

    // Assert
    expect(screen.getByTestId("data-source-row-0").textContent).toContain(
      "custom",
    );
  });
});
