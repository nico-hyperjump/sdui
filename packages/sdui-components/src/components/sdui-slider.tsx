import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum, propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Visual slider display (read-only representation of a range value).
 * In production, wrap with gesture handling for interactivity.
 * @param props - SDUI component props.
 * @returns Rendered slider.
 */
export function SduiSlider({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const min = propNum(component.props, "min");
  const max = propNum(component.props, "max") || 100;
  const value = propNum(component.props, "value");
  const label = propStr(component.props, "label");
  const range = max - min || 1;
  const percent = Math.min(100, Math.max(0, ((value - min) / range) * 100));

  return (
    <View style={styles.sliderContainer}>
      {label ? (
        <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.sliderTrack, { backgroundColor: theme.colors.secondary }]}>
        <View
          style={[
            styles.sliderFill,
            { backgroundColor: theme.colors.accent, width: `${percent}%` },
          ]}
        />
        <View
          style={[
            styles.sliderThumb,
            {
              backgroundColor: theme.colors.accent,
              left: `${percent}%`,
            },
          ]}
        />
      </View>
      <Text style={[styles.sliderValue, { color: theme.colors.text }]}>
        {value}
      </Text>
    </View>
  );
}
