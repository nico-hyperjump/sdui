import { describe, it, expect, vi, afterEach } from "vitest";
import { SduiVideoPlayer } from "./sdui-video-player";

describe("SduiVideoPlayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with poster image", () => {
    // Setup
    const component = {
      id: "vp1",
      type: "video_player" as const,
      props: { uri: "https://example.com/video.mp4", poster: "https://example.com/poster.jpg" },
    };

    // Act
    const result = SduiVideoPlayer({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders without poster", () => {
    // Setup
    const component = {
      id: "vp1",
      type: "video_player" as const,
      props: { uri: "https://example.com/video.mp4" },
    };

    // Act
    const result = SduiVideoPlayer({ component });

    // Assert
    expect(result).not.toBeNull();
  });

  it("renders placeholder when no uri", () => {
    // Setup
    const component = {
      id: "vp1",
      type: "video_player" as const,
      props: {},
    };

    // Act
    const result = SduiVideoPlayer({ component });

    // Assert
    expect(result).not.toBeNull();
  });
});
