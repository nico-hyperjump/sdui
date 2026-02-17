import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Social proof indicator (e.g. "1,234 people bought this").
 * @param props - SDUI component props.
 * @returns Rendered social proof.
 */
export function SduiSocialProof({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const text = propStr(component.props, "text");
  const icon = propStr(component.props, "icon") || "🔥";
  const count = propNum(component.props, "count");

  const displayText = text || (count > 0 ? `${count.toLocaleString()} people` : "");

  return (
    <View style={styles.socialProof}>
      <Text style={styles.socialProofIcon}>{icon}</Text>
      <Text style={[styles.socialProofText, { color: theme.colors.text }]}>
        {displayText}
      </Text>
    </View>
  );
}
