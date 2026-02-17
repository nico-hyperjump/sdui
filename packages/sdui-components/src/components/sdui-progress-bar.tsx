import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum, propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Progress bar or circular progress indicator.
 * @param props - SDUI component props.
 * @returns Rendered progress bar.
 */
export function SduiProgressBar({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const value = propNum(component.props, "value");
  const variant = propStr(component.props, "variant") || "bar";
  const label = propStr(component.props, "label");
  const clamped = Math.min(100, Math.max(0, value));

  if (variant === "circle") {
    return (
      <View style={styles.progressCircleContainer}>
        <View
          style={[
            {
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 4,
              borderColor: theme.colors.accent,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.progressCircleText, { color: theme.colors.text }]}>
            {clamped}%
          </Text>
        </View>
        {label ? (
          <Text style={[styles.progressBarLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarTrack, { backgroundColor: theme.colors.secondary }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: theme.colors.accent,
              width: `${clamped}%`,
            },
          ]}
        />
      </View>
      {label ? (
        <Text style={[styles.progressBarLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}
