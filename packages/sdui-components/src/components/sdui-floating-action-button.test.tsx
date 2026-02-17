import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiFloatingActionButton } from "./sdui-floating-action-button";

describe("SduiFloatingActionButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with default icon", () => {
    // Setup
    const component = {
      id: "fab1",
      type: "floating_action_button" as const,
      props: {},
    };

    // Act
    const result = SduiFloatingActionButton({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with custom icon and label", () => {
    // Setup
    const component = {
      id: "fab1",
      type: "floating_action_button" as const,
      props: { icon: "✏️", label: "Edit" },
    };

    // Act
    const result = SduiFloatingActionButton({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders bottom-left position", () => {
    // Setup
    const component = {
      id: "fab1",
      type: "floating_action_button" as const,
      props: { position: "bottom-left" },
    };

    // Act
    const result = SduiFloatingActionButton({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with navigate action", () => {
    // Setup
    const component = {
      id: "fab1",
      type: "floating_action_button" as const,
      props: {},
      action: { type: "navigate" as const, screen: "/compose" },
    };

    // Act
    const result = SduiFloatingActionButton({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
