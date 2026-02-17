import { useCallback } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { useActionHandler } from "@workspace/sdui-sdk";
import type { SduiAction } from "@workspace/sdui-schema";

/**
 * Mobile-specific action dispatcher that wires `useActionHandler` with
 * `expo-router` navigation and React Native `Linking` for webview URLs.
 *
 * Components call the returned function with a `SduiAction` to handle
 * navigate, webview, custom, show_overlay, and dismiss_overlay actions.
 *
 * @returns A stable callback that dispatches any `SduiAction`.
 */
export function useMobileAction(): (action: SduiAction | undefined) => void {
  const router = useRouter();

  const onNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      router.push({
        pathname: screen,
        params: params as Record<string, string>,
      } as never);
    },
    [router],
  );

  const onWebView = useCallback((url: string) => {
    void Linking.openURL(url);
  }, []);

  return useActionHandler(onNavigate, onWebView);
}
