import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiTabBar } from "./sdui-tab-bar";

describe("SduiTabBar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders tabs", () => {
    // Setup
    const component = {
      id: "tb1",
      type: "tab_bar" as const,
      props: {
        tabs: [{ label: "Tab 1" }, { label: "Tab 2" }],
        selectedIndex: 0,
      },
    };

    // Act
    const result = SduiTabBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with children", () => {
    // Setup
    const component = {
      id: "tb1",
      type: "tab_bar" as const,
      props: { tabs: [{ label: "A" }] },
    };

    // Act
    const result = SduiTabBar({ component, children: "child content" });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty tabs array", () => {
    // Setup
    const component = {
      id: "tb1",
      type: "tab_bar" as const,
      props: { tabs: [] },
    };

    // Act
    const result = SduiTabBar({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
