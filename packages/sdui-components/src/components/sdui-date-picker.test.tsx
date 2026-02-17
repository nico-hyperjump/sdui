import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiDatePicker } from "./sdui-date-picker";

describe("SduiDatePicker", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with label and value", () => {
    // Setup
    const component = {
      id: "dp1",
      type: "date_picker" as const,
      props: { label: "Date", value: "2025-01-15" },
    };

    // Act
    const result = SduiDatePicker({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders placeholder when no value", () => {
    // Setup
    const component = {
      id: "dp1",
      type: "date_picker" as const,
      props: { label: "Departure" },
    };

    // Act
    const result = SduiDatePicker({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders time mode", () => {
    // Setup
    const component = {
      id: "dp1",
      type: "date_picker" as const,
      props: { mode: "time" },
    };

    // Act
    const result = SduiDatePicker({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
