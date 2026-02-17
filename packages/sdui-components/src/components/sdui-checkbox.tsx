import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Checkbox input with label for forms and filters.
 * @param props - SDUI component props.
 * @returns Rendered checkbox.
 */
export function SduiCheckbox({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label = propStr(component.props, "label");
  const initialValue = propBool(component.props, "value");
  const [checked, setChecked] = useState(initialValue);

  return (
    <TouchableOpacity
      onPress={() => setChecked(!checked)}
      style={styles.checkboxContainer}
    >
      <View
        style={[
          styles.checkboxBox,
          {
            backgroundColor: checked ? theme.colors.accent : "transparent",
            borderColor: checked ? theme.colors.accent : theme.colors.secondary,
          },
        ]}
      >
        {checked ? <Text style={styles.checkboxCheck}>✓</Text> : null}
      </View>
      {label ? (
        <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
