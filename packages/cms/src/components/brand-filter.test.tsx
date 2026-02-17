import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrandFilter } from "./brand-filter";
import type { BrandFilterProps } from "./brand-filter";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderBrandFilter(overrides: Partial<BrandFilterProps> = {}) {
  const defaultProps: BrandFilterProps = {
    value: "",
    onChange: vi.fn(),
    ...overrides,
  };
  return {
    onChange: defaultProps.onChange,
    ...render(<BrandFilter {...defaultProps} />),
  };
}

describe("BrandFilter", () => {
  it("renders the All tab and all brand tabs by default", () => {
    // Act
    renderBrandFilter();

    // Assert
    expect(screen.getByRole("tab", { name: "All" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Brand A" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Brand B" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Brand C" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Brand Demo" })).toBeDefined();
  });

  it("does not render the All tab when showAll is false", () => {
    // Act
    renderBrandFilter({ showAll: false, value: "brand_a" });

    // Assert
    expect(screen.queryByRole("tab", { name: "All" })).toBeNull();
    expect(screen.getByRole("tab", { name: "Brand A" })).toBeDefined();
  });

  it("marks the active tab with aria-selected true", () => {
    // Act
    renderBrandFilter({ value: "brand_b" });

    // Assert
    expect(
      screen
        .getByRole("tab", { name: "Brand B" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen.getByRole("tab", { name: "All" }).getAttribute("aria-selected"),
    ).toBe("false");
  });

  it("marks All as active when value is empty string", () => {
    // Act
    renderBrandFilter({ value: "" });

    // Assert
    expect(
      screen.getByRole("tab", { name: "All" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("calls onChange with the brand id when a brand tab is clicked", () => {
    // Setup
    const { onChange } = renderBrandFilter({ value: "" });

    // Act
    fireEvent.click(screen.getByRole("tab", { name: "Brand C" }));

    // Assert
    expect(onChange).toHaveBeenCalledWith("brand_c");
  });

  it("calls onChange with empty string when All tab is clicked", () => {
    // Setup
    const { onChange } = renderBrandFilter({ value: "brand_a" });

    // Act
    fireEvent.click(screen.getByRole("tab", { name: "All" }));

    // Assert
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("renders a tablist role wrapper", () => {
    // Act
    renderBrandFilter();

    // Assert
    expect(screen.getByRole("tablist")).toBeDefined();
  });

  it("renders data-testid for external querying", () => {
    // Act
    renderBrandFilter();

    // Assert
    expect(screen.getByTestId("brand-filter")).toBeDefined();
  });

  it("applies active styling class to the selected tab", () => {
    // Act
    renderBrandFilter({ value: "brand_a" });

    // Assert
    const activeTab = screen.getByRole("tab", { name: "Brand A" });
    expect(activeTab.className).toContain("bg-white");
    expect(activeTab.className).toContain("shadow-sm");
  });

  it("applies inactive styling class to non-selected tabs", () => {
    // Act
    renderBrandFilter({ value: "brand_a" });

    // Assert
    const inactiveTab = screen.getByRole("tab", { name: "Brand B" });
    expect(inactiveTab.className).toContain("text-slate-500");
    expect(inactiveTab.className).not.toContain("shadow-sm");
  });
});
