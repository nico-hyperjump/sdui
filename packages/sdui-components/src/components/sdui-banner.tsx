import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";

const VARIANT_COLORS: Record<string, string> = {
  info: "#2196F3",
  warning: "#FF9800",
  success: "#4CAF50",
  error: "#F44336",
};

/**
 * Dismissible notification banner for announcements or alerts.
 * @param props - SDUI component props.
 * @returns Rendered banner, or null if dismissed.
 */
export function SduiBanner({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const message = propStr(component.props, "message");
  const variant = propStr(component.props, "variant") || "info";
  const dismissible = component.props?.["dismissible"] !== false;
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const bgColor = VARIANT_COLORS[variant] ?? VARIANT_COLORS.info;

  return (
    <View style={[styles.bannerContainer, { backgroundColor: bgColor }]}>
      <Text style={[styles.bannerMessage, { color: "#ffffff" }]}>{message}</Text>
      {dismissible ? (
        <TouchableOpacity onPress={() => setDismissed(true)}>
          <Text style={[styles.bannerDismiss, { color: "#ffffff" }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
