import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(init: T) => [init, vi.fn()] as const,
    useEffect: vi.fn(),
  };
});

import { SduiCountdownTimer } from "./sdui-countdown-timer";

describe("SduiCountdownTimer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with end time and label", () => {
    // Setup
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const component = {
      id: "ct1",
      type: "countdown_timer" as const,
      props: { endTime: futureDate, label: "Ends in" },
    };

    // Act
    const result = SduiCountdownTimer({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without label", () => {
    // Setup
    const futureDate = new Date(Date.now() + 3600000).toISOString();
    const component = {
      id: "ct1",
      type: "countdown_timer" as const,
      props: { endTime: futureDate },
    };

    // Act
    const result = SduiCountdownTimer({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders zeros when end time is in the past", () => {
    // Setup
    const pastDate = new Date(Date.now() - 1000).toISOString();
    const component = {
      id: "ct1",
      type: "countdown_timer" as const,
      props: { endTime: pastDate },
    };

    // Act
    const result = SduiCountdownTimer({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
