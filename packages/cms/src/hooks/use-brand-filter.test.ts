import { describe, it, expect, vi, afterEach } from "vitest";
import { useBrandFilter } from "./use-brand-filter";
import { renderHook, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Wraps the hook in a MemoryRouter with optional initial search params. */
function renderUseBrandFilter(initialSearch = "") {
  return renderHook(() => useBrandFilter(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[`/${initialSearch}`]}>
        {children}
      </MemoryRouter>
    ),
  });
}

describe("useBrandFilter", () => {
  it("returns empty string when no brand param is present", () => {
    // Act
    const { result } = renderUseBrandFilter();

    // Assert
    expect(result.current[0]).toBe("");
  });

  it("returns the brand when a valid brand param is present", () => {
    // Act
    const { result } = renderUseBrandFilter("?brand=brand_a");

    // Assert
    expect(result.current[0]).toBe("brand_a");
  });

  it("returns empty string for an unrecognised brand param", () => {
    // Act
    const { result } = renderUseBrandFilter("?brand=unknown_brand");

    // Assert
    expect(result.current[0]).toBe("");
  });

  it("sets the brand param when setBrand is called with a valid brand", () => {
    // Setup
    const { result } = renderUseBrandFilter();

    // Act
    act(() => {
      result.current[1]("brand_b");
    });

    // Assert
    expect(result.current[0]).toBe("brand_b");
  });

  it("removes the brand param when setBrand is called with empty string", () => {
    // Setup
    const { result } = renderUseBrandFilter("?brand=brand_c");

    // Act
    act(() => {
      result.current[1]("");
    });

    // Assert
    expect(result.current[0]).toBe("");
  });

  it("preserves other search params when setting brand", () => {
    // Setup
    const { result } = renderUseBrandFilter("?page=2&brand=brand_a");

    // Act
    act(() => {
      result.current[1]("brand_demo");
    });

    // Assert
    expect(result.current[0]).toBe("brand_demo");
  });

  it("accepts dependency injection for useSearchParams", () => {
    // Setup
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams("brand=brand_c");
    const mockUseSearchParams = vi.fn().mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]) as unknown as typeof import("react-router-dom").useSearchParams;

    // Act
    const { result } = renderHook(() =>
      useBrandFilter({ useSearchParams: mockUseSearchParams }),
    );

    // Assert
    expect(result.current[0]).toBe("brand_c");
    expect(mockUseSearchParams).toHaveBeenCalled();
  });

  it("calls setSearchParams with replace option when setting brand", () => {
    // Setup
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams();
    const mockUseSearchParams = vi.fn().mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]) as unknown as typeof import("react-router-dom").useSearchParams;

    const { result } = renderHook(() =>
      useBrandFilter({ useSearchParams: mockUseSearchParams }),
    );

    // Act
    act(() => {
      result.current[1]("brand_a");
    });

    // Assert
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(Function),
      { replace: true },
    );
  });

  it("calls setSearchParams updater that sets brand param", () => {
    // Setup
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams();
    const mockUseSearchParams = vi.fn().mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]) as unknown as typeof import("react-router-dom").useSearchParams;

    const { result } = renderHook(() =>
      useBrandFilter({ useSearchParams: mockUseSearchParams }),
    );

    // Act
    act(() => {
      result.current[1]("brand_b");
    });

    // Assert – invoke the updater fn to verify it produces the right params
    const updaterFn = mockSetSearchParams.mock.calls[0][0];
    const produced = updaterFn(new URLSearchParams("other=1"));
    expect(produced.get("brand")).toBe("brand_b");
    expect(produced.get("other")).toBe("1");
  });

  it("calls setSearchParams updater that deletes brand param for empty string", () => {
    // Setup
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams("brand=brand_a");
    const mockUseSearchParams = vi.fn().mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]) as unknown as typeof import("react-router-dom").useSearchParams;

    const { result } = renderHook(() =>
      useBrandFilter({ useSearchParams: mockUseSearchParams }),
    );

    // Act
    act(() => {
      result.current[1]("");
    });

    // Assert
    const updaterFn = mockSetSearchParams.mock.calls[0][0];
    const produced = updaterFn(new URLSearchParams("brand=brand_a&other=1"));
    expect(produced.has("brand")).toBe(false);
    expect(produced.get("other")).toBe("1");
  });
});
