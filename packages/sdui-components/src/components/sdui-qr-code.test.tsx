import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiQrCode } from "./sdui-qr-code";

describe("SduiQrCode", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with value", () => {
    // Setup
    const component = {
      id: "qr1",
      type: "qr_code" as const,
      props: { value: "https://example.com", size: 200 },
    };

    // Act
    const result = SduiQrCode({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without value", () => {
    // Setup
    const component = {
      id: "qr1",
      type: "qr_code" as const,
      props: {},
    };

    // Act
    const result = SduiQrCode({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders with default size", () => {
    // Setup
    const component = {
      id: "qr1",
      type: "qr_code" as const,
      props: { value: "test" },
    };

    // Act
    const result = SduiQrCode({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
