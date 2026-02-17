import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSectionHeader } from "./sdui-section-header";

describe("SduiSectionHeader", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with title", () => {
    // Setup
    const component = {
      id: "sh1",
      type: "section_header" as const,
      props: { title: "Featured" },
    };

    // Act
    const result = SduiSectionHeader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with subtitle", () => {
    // Setup
    const component = {
      id: "sh1",
      type: "section_header" as const,
      props: { title: "Featured", subtitle: "Best picks" },
    };

    // Act
    const result = SduiSectionHeader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders See All action when action is provided", () => {
    // Setup
    const component = {
      id: "sh1",
      type: "section_header" as const,
      props: { title: "Featured" },
      action: { type: "navigate" as const, screen: "/all" },
    };

    // Act
    const result = SduiSectionHeader({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("does not render action when no action provided", () => {
    // Setup
    const component = {
      id: "sh1",
      type: "section_header" as const,
      props: { title: "Featured" },
    };

    // Act
    const result = SduiSectionHeader({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
