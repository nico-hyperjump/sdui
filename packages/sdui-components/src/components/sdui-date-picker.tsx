import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Date picker trigger button (displays selected date).
 * In production, hook up to a native date picker modal.
 * @param props - SDUI component props.
 * @returns Rendered date picker.
 */
export function SduiDatePicker({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label = propStr(component.props, "label");
  const value = propStr(component.props, "value");
  const mode = propStr(component.props, "mode") || "date";
  const displayText = value || `Select ${mode}...`;

  return (
    <View style={styles.datePickerContainer}>
      {label ? (
        <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          styles.datePickerButton,
          {
            borderColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Text style={[styles.datePickerText, { color: theme.colors.text }]}>
          {displayText}
        </Text>
        <Text style={[styles.datePickerIcon, { color: theme.colors.text }]}>
          📅
        </Text>
      </TouchableOpacity>
    </View>
  );
}
