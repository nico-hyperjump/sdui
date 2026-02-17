import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import type {
  ScreenRecord,
  CopyToBrandsResponse,
} from "@workspace/sdui-schema";
import { CopyToBrandsDialog } from "./copy-to-brands-dialog";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeScreen(overrides: Partial<ScreenRecord> = {}): ScreenRecord {
  return {
    id: "uuid-1",
    screenId: "home",
    brand: "brand_a",
    segment: null,
    components: "[]",
    version: 1,
    published: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CopyToBrandsDialog", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders brand checkboxes excluding the source brand", () => {
    // Setup
    const srcScreen = makeScreen({ brand: "brand_a" });

    // Act
    render(
      <CopyToBrandsDialog
        screen={srcScreen}
        open={true}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        copyFn={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Brand B")).toBeDefined();
    expect(screen.getByText("Brand C")).toBeDefined();
    expect(screen.getByText("Brand Demo")).toBeDefined();
    expect(screen.queryByText("Brand A")).toBeNull();
  });

  it("does not render when open is false", () => {
    // Act
    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={false}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        copyFn={vi.fn()}
      />,
    );

    // Assert
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("disables the submit button when no brand is selected", () => {
    // Act
    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        copyFn={vi.fn()}
      />,
    );

    // Assert
    const submitBtn = screen.getByRole("button", { name: /copy to 0 brand/i });
    expect(submitBtn).toBeDefined();
    expect((submitBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it("enables the submit button after selecting a brand", () => {
    // Setup
    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        copyFn={vi.fn()}
      />,
    );

    // Act
    const checkbox = screen.getByLabelText("Brand B");
    fireEvent.click(checkbox);

    // Assert
    const submitBtn = screen.getByRole("button", { name: /copy to 1 brand/i });
    expect((submitBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it("calls copyFn with selected brands and shows results", async () => {
    // Setup
    const mockCopy = vi
      .fn<(id: string, brands: string[]) => Promise<CopyToBrandsResponse>>()
      .mockResolvedValue({
        created: [
          {
            id: "uuid-new",
            screenId: "home",
            brand: "brand_b",
            segment: null,
            components: "[]",
            version: 1,
            published: false,
            createdAt: "2026-02-17T00:00:00Z",
            updatedAt: "2026-02-17T00:00:00Z",
          },
        ],
        skipped: [],
      });
    const onComplete = vi.fn();

    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={vi.fn()}
        onComplete={onComplete}
        copyFn={mockCopy}
      />,
    );

    // Act
    fireEvent.click(screen.getByLabelText("Brand B"));
    fireEvent.click(screen.getByRole("button", { name: /copy to 1 brand/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/created 1 screen/i)).toBeDefined();
    });
    expect(mockCopy).toHaveBeenCalledWith("uuid-1", ["brand_b"]);
    expect(onComplete).toHaveBeenCalled();
  });

  it("shows suffixed screenId when the name conflicted in target brand", async () => {
    // Setup
    const mockCopy = vi
      .fn<(id: string, brands: string[]) => Promise<CopyToBrandsResponse>>()
      .mockResolvedValue({
        created: [
          {
            id: "uuid-new",
            screenId: "home-copy",
            brand: "brand_c",
            segment: null,
            components: "[]",
            version: 1,
            published: false,
            createdAt: "2026-02-17T00:00:00Z",
            updatedAt: "2026-02-17T00:00:00Z",
          },
        ],
        skipped: [],
      });
    const onComplete = vi.fn();

    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={vi.fn()}
        onComplete={onComplete}
        copyFn={mockCopy}
      />,
    );

    // Act
    fireEvent.click(screen.getByLabelText("Brand C"));
    fireEvent.click(screen.getByRole("button", { name: /copy to 1 brand/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/created 1 screen/i)).toBeDefined();
    });
    expect(screen.getByText(/as home-copy/i)).toBeDefined();
    expect(onComplete).toHaveBeenCalled();
  });

  it("shows an error message when the copy request fails", async () => {
    // Setup
    const mockCopy = vi.fn().mockRejectedValue(new Error("Network error"));

    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        copyFn={mockCopy}
      />,
    );

    // Act
    fireEvent.click(screen.getByLabelText("Brand B"));
    fireEvent.click(screen.getByRole("button", { name: /copy to 1 brand/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeDefined();
    });
  });

  it("calls onClose when the close button is clicked", () => {
    // Setup
    const onClose = vi.fn();

    render(
      <CopyToBrandsDialog
        screen={makeScreen()}
        open={true}
        onClose={onClose}
        onComplete={vi.fn()}
        copyFn={vi.fn()}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(onClose).toHaveBeenCalledOnce();
  });
});
