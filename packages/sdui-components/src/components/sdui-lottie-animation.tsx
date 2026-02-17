import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum, propBool } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Lottie animation placeholder. In production, replace with lottie-react-native.
 * @param props - SDUI component props.
 * @returns Rendered Lottie placeholder.
 */
export function SduiLottieAnimation({
  component,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const source = propStr(component.props, "source");
  const width = propNum(component.props, "width") || 120;
  const height = propNum(component.props, "height") || 120;
  const autoPlay = propBool(component.props, "autoPlay");
  const loop = propBool(component.props, "loop");

  return (
    <View style={[styles.lottieContainer, { width, height }]}>
      <Text style={[styles.lottiePlaceholder, { color: theme.colors.text }]}>
        Lottie{autoPlay ? " ▶" : ""}{loop ? " ↻" : ""}
      </Text>
      {source ? (
        <Text
          style={[styles.lottiePlaceholder, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {source}
        </Text>
      ) : null}
    </View>
  );
}
