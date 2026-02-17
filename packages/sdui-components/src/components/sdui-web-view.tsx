import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Web view placeholder. In production, use react-native-webview.
 * @param props - SDUI component props.
 * @returns Rendered web view placeholder.
 */
export function SduiWebView({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const url =
    propStr(component.props, "url") ||
    (component.action && "url" in component.action
      ? (component.action as { url: string }).url
      : "");
  return (
    <View
      style={[
        styles.webViewPlaceholder,
        { backgroundColor: theme.colors.secondary },
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.text }]}>
        WebView: {url || "—"}
      </Text>
    </View>
  );
}
