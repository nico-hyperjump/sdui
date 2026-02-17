import { View, Text, Switch } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Toggle switch with label for settings-style on/off controls.
 * @param props - SDUI component props.
 * @returns Rendered toggle.
 */
export function SduiToggle({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label = propStr(component.props, "label");
  const value = propBool(component.props, "value");

  return (
    <View style={styles.toggleContainer}>
      {label ? (
        <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      <Switch
        value={value}
        trackColor={{
          false: theme.colors.secondary,
          true: theme.colors.accent,
        }}
      />
    </View>
  );
}
