import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiToggle } from "./sdui-toggle";

describe("SduiToggle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with label", () => {
    // Setup
    const component = {
      id: "t1",
      type: "toggle" as const,
      props: { label: "Notifications", value: true },
    };

    // Act
    const result = SduiToggle({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const component = {
      id: "t1",
      type: "toggle" as const,
      props: { value: false },
    };

    // Act
    const result = SduiToggle({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
