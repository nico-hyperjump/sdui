import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiSwipeableRow } from "./sdui-swipeable-row";

describe("SduiSwipeableRow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with children and right actions", () => {
    // Setup
    const component = {
      id: "sr1",
      type: "swipeable_row" as const,
      props: {
        rightActions: [
          { label: "Delete", color: "#F44336" },
          { label: "Archive", color: "#2196F3" },
        ],
      },
    };

    // Act
    const result = SduiSwipeableRow({ component, children: "Row content" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without actions", () => {
    // Setup
    const component = {
      id: "sr1",
      type: "swipeable_row" as const,
      props: {},
    };

    // Act
    const result = SduiSwipeableRow({ component, children: "Content" });

    // Assert
    expect(result).not.toBeNull();
  });
});
