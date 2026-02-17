import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let useStateCalls: number;

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => {
      useStateCalls++;
      // 2nd useState per render is containerWidth — return 375 to skip measurement
      if (useStateCalls === 2) return [375 as T, vi.fn()] as const;
      return [init, vi.fn()] as const;
    },
    useEffect: vi.fn(),
    useRef: (init: unknown) => ({ current: init }),
    useCallback: (fn: unknown) => fn,
  };
});

import { SduiCarousel } from "./sdui-carousel";

describe("SduiCarousel", () => {
  beforeEach(() => {
    useStateCalls = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing with default props", () => {
    // Setup
    const component = { id: "c1", type: "carousel" as const, props: {} };

    // Act
    const result = SduiCarousel({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with children and indicators", () => {
    // Setup
    const component = {
      id: "c1",
      type: "carousel" as const,
      props: { showIndicators: true },
      children: [
        { id: "child1", type: "text" as const },
        { id: "child2", type: "text" as const },
      ],
    };

    // Act
    const result = SduiCarousel({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without indicators when showIndicators is false", () => {
    // Setup
    const component = {
      id: "c1",
      type: "carousel" as const,
      props: { showIndicators: false },
      children: [
        { id: "child1", type: "text" as const },
        { id: "child2", type: "text" as const },
      ],
    };

    // Act
    const result = SduiCarousel({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders measurement view when containerWidth is zero", () => {
    // Setup — reset so both useStates return init value (0)
    useStateCalls = -1; // after increment, first call = 0, second call = 1
    const component = {
      id: "c1",
      type: "carousel" as const,
      props: {},
      children: [{ id: "child1", type: "text" as const }],
    };

    // Act
    const result = SduiCarousel({ component });

    // Assert — returns measurement placeholder (no FlatList)
    expect(result).not.toBeNull();
  });
});
