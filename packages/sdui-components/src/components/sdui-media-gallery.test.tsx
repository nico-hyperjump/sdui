import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiMediaGallery } from "./sdui-media-gallery";

describe("SduiMediaGallery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with items", () => {
    // Setup
    const component = {
      id: "mg1",
      type: "media_gallery" as const,
      props: {
        items: [
          { uri: "https://example.com/1.jpg" },
          { uri: "https://example.com/2.jpg" },
        ],
      },
    };

    // Act
    const result = SduiMediaGallery({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders empty gallery", () => {
    // Setup
    const component = {
      id: "mg1",
      type: "media_gallery" as const,
      props: { items: [] },
    };

    // Act
    const result = SduiMediaGallery({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
