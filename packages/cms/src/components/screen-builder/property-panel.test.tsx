import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type {
  SduiComponent,
  SduiDataSource,
  DataProviderSchema,
} from "@workspace/sdui-schema";
import type { BuilderAction } from "./types";
import { PropertyPanel } from "./property-panel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeComponent(overrides?: Partial<SduiComponent>): SduiComponent {
  return {
    id: "text_1",
    type: "text",
    props: { content: "Hello" },
    ...overrides,
  };
}

/** Creates minimal data sources and schemas for binding picker tests. */
function createBindingContext(): {
  dataSources: SduiDataSource[];
  providerSchemas: DataProviderSchema[];
} {
  return {
    dataSources: [{ id: "account", provider: "account" }],
    providerSchemas: [
      {
        name: "account",
        label: "Account Data",
        description: "Account info",
        fields: [
          { name: "name", label: "Account Name", type: "string" },
          { name: "balance", label: "Balance", type: "number" },
        ],
      },
    ],
  };
}

function renderPanel(
  component: SduiComponent | null,
  dispatchOverride?: React.Dispatch<BuilderAction>,
  screenIds?: string[],
  options?: {
    dataSources?: SduiDataSource[];
    providerSchemas?: DataProviderSchema[];
  },
) {
  const dispatch = dispatchOverride ?? vi.fn();
  return {
    dispatch,
    ...render(
      <PropertyPanel
        component={component}
        dispatch={dispatch}
        screenIds={screenIds}
        dataSources={options?.dataSources}
        providerSchemas={options?.providerSchemas}
      />,
    ),
  };
}

describe("PropertyPanel", () => {
  it("renders empty state when no component is selected", () => {
    // Act
    renderPanel(null);

    // Assert
    expect(screen.getByTestId("property-panel-empty")).toBeDefined();
  });

  it("renders component type header when a component is selected", () => {
    // Act
    renderPanel(makeComponent());

    // Assert
    expect(screen.getByTestId("property-type-header")).toBeDefined();
    expect(screen.getByTestId("property-type-header").textContent).toContain(
      "Text",
    );
  });

  it("renders prop fields for the selected component type", () => {
    // Act
    renderPanel(makeComponent());

    // Assert
    expect(screen.getByTestId("prop-field-content")).toBeDefined();
    expect(screen.getByTestId("prop-field-variant")).toBeDefined();
  });

  it("dispatches UPDATE_COMPONENT when a string prop changes", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.change(screen.getByTestId("prop-field-content"), {
      target: { value: "New text" },
    });

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { props: { content: "New text" } },
    });
  });

  it("dispatches UPDATE_COMPONENT when component ID changes", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.change(screen.getByTestId("prop-field-id"), {
      target: { value: "text_2" },
    });

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { id: "text_2" },
    });
  });

  it("renders select field for variant prop", () => {
    // Act
    renderPanel(
      makeComponent({ props: { content: "Hi", variant: "heading" } }),
    );

    // Assert
    const select = screen.getByTestId(
      "prop-field-variant",
    ) as HTMLSelectElement;
    expect(select.value).toBe("heading");
  });

  it("renders number field for numeric props", () => {
    // Setup
    const comp = makeComponent({
      id: "stack_1",
      type: "stack",
      props: { gap: 16 },
    });

    // Act
    renderPanel(comp);

    // Assert
    const input = screen.getByTestId("prop-field-gap") as HTMLInputElement;
    expect(input.type).toBe("number");
    expect(input.value).toBe("16");
  });

  it("renders boolean toggle for boolean props", () => {
    // Setup
    const comp = makeComponent({
      id: "carousel_1",
      type: "carousel",
      props: { autoPlay: true },
    });
    const dispatch = vi.fn();

    // Act
    renderPanel(comp, dispatch);
    fireEvent.click(screen.getByTestId("prop-field-autoPlay"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "carousel_1",
      updates: { props: { autoPlay: false } },
    });
  });

  it("renders action editor section", () => {
    // Act
    renderPanel(makeComponent());

    // Assert
    expect(screen.getByTestId("action-editor")).toBeDefined();
    expect(screen.getByTestId("action-type-select")).toBeDefined();
  });

  it("dispatches action update when navigate is selected", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.change(screen.getByTestId("action-type-select"), {
      target: { value: "navigate" },
    });

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { action: { type: "navigate", screen: "" } },
    });
  });

  it("clears action when None is selected", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(
      makeComponent({ action: { type: "navigate", screen: "home" } }),
      dispatch,
    );

    // Act
    fireEvent.change(screen.getByTestId("action-type-select"), {
      target: { value: "" },
    });

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { action: undefined },
    });
  });

  it("shows screen picker for navigate action with current value selected", () => {
    // Act
    renderPanel(
      makeComponent({ action: { type: "navigate", screen: "home" } }),
      undefined,
      ["home", "account", "plans"],
    );

    // Assert
    const select = screen.getByTestId(
      "action-screen-select",
    ) as HTMLSelectElement;
    expect(select.value).toBe("home");
  });

  it("renders all available screenIds as picker options", () => {
    // Setup
    const ids = ["account", "home", "plans"];

    // Act
    renderPanel(
      makeComponent({ action: { type: "navigate", screen: "" } }),
      undefined,
      ids,
    );

    // Assert
    const select = screen.getByTestId(
      "action-screen-select",
    ) as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toEqual(["", "account", "home", "plans"]);
  });

  it("includes the current screen value even if not in screenIds list", () => {
    // Act
    renderPanel(
      makeComponent({ action: { type: "navigate", screen: "legacy" } }),
      undefined,
      ["home", "account"],
    );

    // Assert
    const select = screen.getByTestId(
      "action-screen-select",
    ) as HTMLSelectElement;
    expect(select.value).toBe("legacy");
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("legacy");
  });

  it("dispatches updated screen when a screen is picked", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(
      makeComponent({ action: { type: "navigate", screen: "" } }),
      dispatch,
      ["home", "account"],
    );

    // Act
    fireEvent.change(screen.getByTestId("action-screen-select"), {
      target: { value: "account" },
    });

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { action: { type: "navigate", screen: "account" } },
    });
  });

  it("shows URL input for webview action", () => {
    // Act
    renderPanel(
      makeComponent({
        action: { type: "webview", url: "https://example.com" },
      }),
    );

    // Assert
    const input = screen.getByTestId("action-url-input") as HTMLInputElement;
    expect(input.value).toBe("https://example.com");
  });

  it("shows name input for custom action", () => {
    // Act
    renderPanel(
      makeComponent({ action: { type: "custom", name: "my_action" } }),
    );

    // Assert
    expect(screen.getByTestId("action-name-input")).toBeDefined();
  });

  it("shows overlay input for show_overlay action", () => {
    // Act
    renderPanel(
      makeComponent({ action: { type: "show_overlay", overlayId: "promo" } }),
    );

    // Assert
    expect(screen.getByTestId("action-overlay-input")).toBeDefined();
  });

  it("renders conditions editor section", () => {
    // Act
    renderPanel(makeComponent());

    // Assert
    expect(screen.getByTestId("conditions-editor")).toBeDefined();
    expect(screen.getByTestId("condition-add")).toBeDefined();
  });

  it("adds a condition when the add button is clicked", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.click(screen.getByTestId("condition-add"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: {
        conditions: [{ field: "", operator: "eq", value: "" }],
      },
    });
  });

  it("renders existing conditions", () => {
    // Act
    renderPanel(
      makeComponent({
        conditions: [{ field: "brand", operator: "eq", value: "brand_a" }],
      }),
    );

    // Assert
    const field = screen.getByTestId("condition-field-0") as HTMLInputElement;
    expect(field.value).toBe("brand");
  });

  it("removes a condition when delete is clicked", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(
      makeComponent({
        conditions: [
          { field: "brand", operator: "eq", value: "brand_a" },
          { field: "segment", operator: "eq", value: "prepaid" },
        ],
      }),
      dispatch,
    );

    // Act
    fireEvent.click(screen.getByTestId("condition-remove-0"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: {
        conditions: [{ field: "segment", operator: "eq", value: "prepaid" }],
      },
    });
  });

  it("shows extra props section for unregistered props", () => {
    // Act
    renderPanel(
      makeComponent({
        props: { content: "Hello", customKey: "customValue" },
      }),
    );

    // Assert
    expect(screen.getByTestId("extra-props-section")).toBeDefined();
  });

  it("applies custom props JSON", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.change(screen.getByTestId("custom-props-input"), {
      target: { value: '{"foo":"bar"}' },
    });
    fireEvent.click(screen.getByTestId("custom-props-apply"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { props: { content: "Hello", foo: "bar" } },
    });
  });

  it("ignores invalid JSON when applying custom props", () => {
    // Setup
    const dispatch = vi.fn();
    renderPanel(makeComponent(), dispatch);

    // Act
    fireEvent.change(screen.getByTestId("custom-props-input"), {
      target: { value: "not-json" },
    });
    fireEvent.click(screen.getByTestId("custom-props-apply"));

    // Assert - dispatch should not have been called for the custom props apply
    const updateCalls = (
      dispatch as ReturnType<typeof vi.fn>
    ).mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as BuilderAction).type === "UPDATE_COMPONENT",
    );
    expect(updateCalls).toHaveLength(0);
  });

  it("renders the data-binding picker for string fields when data sources exist", () => {
    // Setup
    const { dataSources, providerSchemas } = createBindingContext();

    // Act
    renderPanel(makeComponent(), undefined, undefined, {
      dataSources,
      providerSchemas,
    });

    // Assert
    expect(screen.getByTestId("data-binding-picker")).toBeDefined();
  });

  it("does not render the data-binding picker when no data sources exist", () => {
    // Act
    renderPanel(makeComponent());

    // Assert
    expect(screen.queryByTestId("data-binding-picker")).toBeNull();
  });

  it("shows 'Dynamic value' indicator for fields with template expressions", () => {
    // Setup
    const { dataSources, providerSchemas } = createBindingContext();

    // Act
    renderPanel(
      makeComponent({ props: { content: "{{account.name}}" } }),
      undefined,
      undefined,
      { dataSources, providerSchemas },
    );

    // Assert
    expect(screen.getByTestId("prop-field-content-bound")).toBeDefined();
    expect(screen.getByTestId("prop-field-content-bound").textContent).toBe(
      "Dynamic value",
    );
  });

  it("does not show 'Dynamic value' indicator for static values", () => {
    // Setup
    const { dataSources, providerSchemas } = createBindingContext();

    // Act
    renderPanel(
      makeComponent({ props: { content: "Hello world" } }),
      undefined,
      undefined,
      { dataSources, providerSchemas },
    );

    // Assert
    expect(screen.queryByTestId("prop-field-content-bound")).toBeNull();
  });

  it("inserts expression into field value when binding picker selects a field", () => {
    // Setup
    const dispatch = vi.fn();
    const { dataSources, providerSchemas } = createBindingContext();
    renderPanel(
      makeComponent({ props: { content: "" } }),
      dispatch,
      undefined,
      { dataSources, providerSchemas },
    );

    // Act - open picker and select a field
    fireEvent.click(screen.getByTestId("data-binding-trigger"));
    fireEvent.click(screen.getByTestId("binding-field-account.name"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { props: { content: "{{account.name}}" } },
    });
  });

  it("appends expression to existing field value", () => {
    // Setup
    const dispatch = vi.fn();
    const { dataSources, providerSchemas } = createBindingContext();
    renderPanel(
      makeComponent({ props: { content: "Hello " } }),
      dispatch,
      undefined,
      { dataSources, providerSchemas },
    );

    // Act - open picker and select a field
    fireEvent.click(screen.getByTestId("data-binding-trigger"));
    fireEvent.click(screen.getByTestId("binding-field-account.name"));

    // Assert
    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COMPONENT",
      id: "text_1",
      updates: { props: { content: "Hello {{account.name}}" } },
    });
  });
});
