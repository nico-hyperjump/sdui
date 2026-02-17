import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiTextInput } from "./sdui-text-input";

describe("SduiTextInput", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with label and placeholder", () => {
    // Setup
    const component = {
      id: "ti1",
      type: "text_input" as const,
      props: { label: "Email", placeholder: "Enter email" },
    };

    // Act
    const result = SduiTextInput({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "ti1",
      type: "text_input" as const,
      props: { placeholder: "Search..." },
    };

    // Act
    const result = SduiTextInput({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders password input type", () => {
    // Setup
    const component = {
      id: "ti1",
      type: "text_input" as const,
      props: { label: "Password", inputType: "password" },
    };

    // Act
    const result = SduiTextInput({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders email input type", () => {
    // Setup
    const component = {
      id: "ti1",
      type: "text_input" as const,
      props: { inputType: "email" },
    };

    // Act
    const result = SduiTextInput({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
