import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Stepper: +/- quantity selector for carts and counters.
 * @param props - SDUI component props.
 * @returns Rendered stepper.
 */
export function SduiStepper({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const initialValue = propNum(component.props, "value") || 1;
  const min = propNum(component.props, "min");
  const max = propNum(component.props, "max") || 99;
  const step = propNum(component.props, "step") || 1;
  const [value, setValue] = useState(initialValue);

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity
        onPress={() => setValue((v) => Math.max(min, v - step))}
        style={[styles.stepperButton, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={styles.stepperButtonText}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.stepperValue, { color: theme.colors.text }]}>
        {value}
      </Text>
      <TouchableOpacity
        onPress={() => setValue((v) => Math.min(max, v + step))}
        style={[styles.stepperButton, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
