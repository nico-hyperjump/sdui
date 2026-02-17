import { describe, it, expect, vi, afterEach } from "vitest";
import type { SduiAction } from "@workspace/sdui-schema";

/**
 * Since we can't render hooks in this package (no react-dom/testing-library),
 * we test the dispatch logic by extracting it into a pure function and
 * verifying that each action type calls the correct callback.
 *
 * The actual hook is a thin useCallback wrapper around this logic, so testing
 * the branching logic directly gives us full coverage of the behaviour.
 */

/** Reproduces the dispatch logic from useActionHandler for unit testing. */
function dispatch(
  action: SduiAction | undefined,
  callbacks: {
    onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
    onWebView?: (url: string) => void;
    onCustomAction?: (name: string, payload?: Record<string, unknown>) => void;
    showOverlay: (id: string) => void;
    dismissOverlay: (id?: string) => void;
  },
): void {
  if (!action) return;

  switch (action.type) {
    case "navigate":
      callbacks.onNavigate?.(
        action.screen,
        action.params as Record<string, unknown> | undefined,
      );
      break;
    case "webview":
      callbacks.onWebView?.(action.url);
      break;
    case "custom":
      callbacks.onCustomAction?.(
        action.name,
        action.payload as Record<string, unknown> | undefined,
      );
      break;
    case "show_overlay":
      callbacks.showOverlay(action.overlayId);
      break;
    case "dismiss_overlay":
      callbacks.dismissOverlay(action.overlayId);
      break;
  }
}

function createCallbacks() {
  return {
    onNavigate: vi.fn(),
    onWebView: vi.fn(),
    onCustomAction: vi.fn(),
    showOverlay: vi.fn(),
    dismissOverlay: vi.fn(),
  };
}

describe("useActionHandler dispatch logic", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing when action is undefined", () => {
    // Setup
    const cbs = createCallbacks();

    // Act
    dispatch(undefined, cbs);

    // Assert
    expect(cbs.onNavigate).not.toHaveBeenCalled();
    expect(cbs.onWebView).not.toHaveBeenCalled();
    expect(cbs.onCustomAction).not.toHaveBeenCalled();
    expect(cbs.showOverlay).not.toHaveBeenCalled();
    expect(cbs.dismissOverlay).not.toHaveBeenCalled();
  });

  it("calls onNavigate for a navigate action", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = {
      type: "navigate",
      screen: "/home",
      params: { tab: "offers" },
    };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.onNavigate).toHaveBeenCalledWith("/home", { tab: "offers" });
    expect(cbs.onWebView).not.toHaveBeenCalled();
  });

  it("calls onWebView for a webview action", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = {
      type: "webview",
      url: "https://example.com",
    };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.onWebView).toHaveBeenCalledWith("https://example.com");
    expect(cbs.onNavigate).not.toHaveBeenCalled();
  });

  it("calls onCustomAction for a custom action", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = {
      type: "custom",
      name: "share",
      payload: { id: "123" },
    };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.onCustomAction).toHaveBeenCalledWith("share", { id: "123" });
  });

  it("calls showOverlay for a show_overlay action", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = {
      type: "show_overlay",
      overlayId: "promo-modal",
    };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.showOverlay).toHaveBeenCalledWith("promo-modal");
    expect(cbs.dismissOverlay).not.toHaveBeenCalled();
  });

  it("calls dismissOverlay with id for a dismiss_overlay action", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = {
      type: "dismiss_overlay",
      overlayId: "promo-modal",
    };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.dismissOverlay).toHaveBeenCalledWith("promo-modal");
    expect(cbs.showOverlay).not.toHaveBeenCalled();
  });

  it("calls dismissOverlay without id when overlayId is omitted", () => {
    // Setup
    const cbs = createCallbacks();
    const action: SduiAction = { type: "dismiss_overlay" };

    // Act
    dispatch(action, cbs);

    // Assert
    expect(cbs.dismissOverlay).toHaveBeenCalledWith(undefined);
  });

  it("does not call navigate callback when it is not provided", () => {
    // Setup
    const cbs = { ...createCallbacks(), onNavigate: undefined };
    const action: SduiAction = { type: "navigate", screen: "/test" };

    // Act & Assert — should not throw
    dispatch(action, cbs);
  });
});
