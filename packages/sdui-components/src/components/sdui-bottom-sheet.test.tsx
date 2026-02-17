import { describe, it, expect, vi, afterEach } from "vitest";

const mockSetVisible = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, mockSetVisible] as const,
    useCallback: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  };
});

import { SduiBottomSheet } from "./sdui-bottom-sheet";

describe("SduiBottomSheet", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockSetVisible.mockClear();
  });

  it("renders with children when visible", () => {
    // Setup
    const component = {
      id: "bs1",
      type: "bottom_sheet" as const,
      props: {},
    };

    // Act
    const result = SduiBottomSheet({ component, children: "Sheet content" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders dismissible sheet by default", () => {
    // Setup
    const component = {
      id: "bs1",
      type: "bottom_sheet" as const,
      props: {},
    };

    // Act
    const result = SduiBottomSheet({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("calls setVisible(false) when backdrop is pressed and dismissible", () => {
    // Setup
    const component = {
      id: "bs1",
      type: "bottom_sheet" as const,
      props: {},
    };
    const tree = SduiBottomSheet({
      component,
      children: "Content",
    }) as { props: { children: { props: { onPress: () => void } } } };

    // Act — simulate backdrop press via the outer TouchableOpacity's onPress
    const backdropOnPress = tree.props.children.props.onPress;
    backdropOnPress();

    // Assert
    expect(mockSetVisible).toHaveBeenCalledWith(false);
  });

  it("does not dismiss when dismissible is false", () => {
    // Setup
    const component = {
      id: "bs1",
      type: "bottom_sheet" as const,
      props: { dismissible: false },
    };
    const tree = SduiBottomSheet({
      component,
      children: "Content",
    }) as { props: { children: { props: { onPress: () => void } } } };

    // Act — simulate backdrop press
    const backdropOnPress = tree.props.children.props.onPress;
    backdropOnPress();

    // Assert
    expect(mockSetVisible).not.toHaveBeenCalled();
  });
});
