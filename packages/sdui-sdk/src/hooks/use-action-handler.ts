import { useCallback } from "react";
import type { SduiAction } from "@workspace/sdui-schema";
import { useOverlay } from "../overlay/overlay-context";

/**
 * Callback invoked when a `navigate` action is handled.
 *
 * @param screen - Target screen identifier.
 * @param params - Optional navigation parameters.
 */
export type OnNavigate = (
  screen: string,
  params?: Record<string, unknown>,
) => void;

/**
 * Callback invoked when a `webview` action is handled.
 *
 * @param url - URL to open.
 */
export type OnWebView = (url: string) => void;

/**
 * Callback invoked when a `custom` action is handled.
 *
 * @param name - Custom action name.
 * @param payload - Optional payload data.
 */
export type OnCustomAction = (
  name: string,
  payload?: Record<string, unknown>,
) => void;

/**
 * Creates a centralised action dispatcher that handles all SDUI action types.
 *
 * Overlay actions (`show_overlay`, `dismiss_overlay`) are handled internally
 * via the `OverlayContext`. Navigation, webview, and custom actions are
 * delegated to injectable callbacks so the SDK stays decoupled from
 * `expo-router` and `Linking`.
 *
 * @param onNavigate - Handler for `navigate` actions (e.g. `router.push`).
 * @param onWebView - Handler for `webview` actions (e.g. `Linking.openURL`).
 * @param onCustomAction - Handler for `custom` actions.
 * @returns A stable callback that dispatches a given `SduiAction`.
 */
export function useActionHandler(
  onNavigate?: OnNavigate,
  onWebView?: OnWebView,
  onCustomAction?: OnCustomAction,
): (action: SduiAction | undefined) => void {
  const { showOverlay, dismissOverlay } = useOverlay();

  return useCallback(
    (action: SduiAction | undefined): void => {
      if (!action) return;

      switch (action.type) {
        case "navigate":
          onNavigate?.(
            action.screen,
            action.params as Record<string, unknown> | undefined,
          );
          break;
        case "webview":
          onWebView?.(action.url);
          break;
        case "custom":
          onCustomAction?.(
            action.name,
            action.payload as Record<string, unknown> | undefined,
          );
          break;
        case "show_overlay":
          showOverlay(action.overlayId);
          break;
        case "dismiss_overlay":
          dismissOverlay(action.overlayId);
          break;
      }
    },
    [onNavigate, onWebView, onCustomAction, showOverlay, dismissOverlay],
  );
}
