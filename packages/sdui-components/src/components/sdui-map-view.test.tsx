import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiMapView } from "./sdui-map-view";

describe("SduiMapView", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with coordinates", () => {
    // Setup
    const component = {
      id: "mv1",
      type: "map_view" as const,
      props: { latitude: -6.2088, longitude: 106.8456 },
    };

    // Act
    const result = SduiMapView({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with style prop", () => {
    // Setup
    const component = {
      id: "mv1",
      type: "map_view" as const,
      props: { latitude: 0, longitude: 0, style: "satellite" },
    };

    // Act
    const result = SduiMapView({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
