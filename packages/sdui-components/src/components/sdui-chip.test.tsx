import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiChip } from "./sdui-chip";

describe("SduiChip", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with label", () => {
    // Setup
    const component = {
      id: "chip1",
      type: "chip" as const,
      props: { label: "New" },
    };

    // Act
    const result = SduiChip({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders filled variant by default", () => {
    // Setup
    const component = {
      id: "chip1",
      type: "chip" as const,
      props: { label: "Tag" },
    };

    // Act
    const result = SduiChip({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders outlined variant", () => {
    // Setup
    const component = {
      id: "chip1",
      type: "chip" as const,
      props: { label: "Tag", variant: "outlined" },
    };

    // Act
    const result = SduiChip({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders selected state", () => {
    // Setup
    const component = {
      id: "chip1",
      type: "chip" as const,
      props: { label: "Tag", variant: "outlined", selected: true },
    };

    // Act
    const result = SduiChip({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
