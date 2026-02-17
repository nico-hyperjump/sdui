import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type {
  SduiDataSource,
  DataProviderSchema,
} from "@workspace/sdui-schema";
import { DataBindingPicker } from "./data-binding-picker";

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
    description: "Account info",
    fields: [
      { name: "name", label: "Account Name", type: "string" },
      { name: "balance", label: "Balance", type: "number" },
    ],
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

describe("DataBindingPicker", () => {
  it("renders nothing when there are no data sources", () => {
    // Act
    const { container } = render(
      <DataBindingPicker
        dataSources={[]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );

    // Assert
    expect(container.innerHTML).toBe("");
  });

  it("renders the trigger button when data sources are available", () => {
    // Act
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByTestId("data-binding-trigger")).toBeDefined();
  });

  it("opens the popover when the trigger is clicked", () => {
    // Setup
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Assert
    expect(screen.getByTestId("data-binding-popover")).toBeDefined();
  });

  it("shows data source groups in the popover", () => {
    // Setup
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Assert
    expect(screen.getByTestId("binding-source-account")).toBeDefined();
  });

  it("shows available fields for each data source", () => {
    // Setup
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Assert
    expect(screen.getByTestId("binding-field-account.name")).toBeDefined();
    expect(screen.getByTestId("binding-field-account.balance")).toBeDefined();
  });

  it("calls onSelect with the expression when a field is clicked", () => {
    // Setup
    const onSelect = vi.fn();
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Act
    fireEvent.click(screen.getByTestId("binding-field-account.name"));

    // Assert
    expect(onSelect).toHaveBeenCalledWith("{{account.name}}");
  });

  it("closes the popover after selecting a field", () => {
    // Setup
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[createSchema()]}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Act
    fireEvent.click(screen.getByTestId("binding-field-account.name"));

    // Assert
    expect(screen.queryByTestId("data-binding-popover")).toBeNull();
  });

  it("uses the data source alias in the expression path", () => {
    // Setup
    const onSelect = vi.fn();
    render(
      <DataBindingPicker
        dataSources={[
          createDataSource({ id: "myAccount", provider: "account" }),
        ]}
        providerSchemas={[createSchema()]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Act
    fireEvent.click(screen.getByTestId("binding-field-myAccount.balance"));

    // Assert
    expect(onSelect).toHaveBeenCalledWith("{{myAccount.balance}}");
  });

  it("shows multiple data sources", () => {
    // Setup
    const schemas = [
      createSchema({
        name: "account",
        label: "Account",
        fields: [{ name: "name", label: "Name", type: "string" }],
      }),
      createSchema({
        name: "marketing",
        label: "Marketing",
        fields: [{ name: "title", label: "Title", type: "string" }],
      }),
    ];
    render(
      <DataBindingPicker
        dataSources={[
          createDataSource({ id: "account", provider: "account" }),
          createDataSource({ id: "offers", provider: "marketing" }),
        ]}
        providerSchemas={schemas}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Assert
    expect(screen.getByTestId("binding-source-account")).toBeDefined();
    expect(screen.getByTestId("binding-source-offers")).toBeDefined();
  });

  it("expands nested object fields when clicked", () => {
    // Setup
    const schema = createSchema({
      fields: [
        {
          name: "address",
          label: "Address",
          type: "object",
          children: [
            { name: "city", label: "City", type: "string" },
            { name: "zip", label: "Zip Code", type: "string" },
          ],
        },
      ],
    });
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[schema]}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Act - expand the object node
    fireEvent.click(screen.getByTestId("binding-field-account.address"));

    // Assert
    expect(
      screen.getByTestId("binding-field-account.address.city"),
    ).toBeDefined();
    expect(
      screen.getByTestId("binding-field-account.address.zip"),
    ).toBeDefined();
  });

  it("selects nested field with correct dot-path expression", () => {
    // Setup
    const onSelect = vi.fn();
    const schema = createSchema({
      fields: [
        {
          name: "address",
          label: "Address",
          type: "object",
          children: [{ name: "city", label: "City", type: "string" }],
        },
      ],
    });
    render(
      <DataBindingPicker
        dataSources={[createDataSource()]}
        providerSchemas={[schema]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));
    fireEvent.click(screen.getByTestId("binding-field-account.address"));

    // Act
    fireEvent.click(screen.getByTestId("binding-field-account.address.city"));

    // Assert
    expect(onSelect).toHaveBeenCalledWith("{{account.address.city}}");
  });

  it("closes popover when clicking outside", () => {
    // Setup
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <DataBindingPicker
          dataSources={[createDataSource()]}
          providerSchemas={[createSchema()]}
          onSelect={vi.fn()}
        />
      </div>,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));
    expect(screen.getByTestId("data-binding-popover")).toBeDefined();

    // Act
    fireEvent.mouseDown(screen.getByTestId("outside"));

    // Assert
    expect(screen.queryByTestId("data-binding-popover")).toBeNull();
  });

  it("skips data sources whose provider has no schema", () => {
    // Setup
    render(
      <DataBindingPicker
        dataSources={[createDataSource({ id: "unknown", provider: "unknown" })]}
        providerSchemas={[createSchema({ name: "account" })]}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("data-binding-trigger"));

    // Assert
    expect(screen.queryByTestId("binding-source-unknown")).toBeNull();
  });
});
