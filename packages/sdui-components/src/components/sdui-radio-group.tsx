import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propArr } from "../prop-helpers";
import { styles } from "../styles";

interface RadioOption {
  label: string;
  value: string;
}

/**
 * Radio group: single-select option list.
 * @param props - SDUI component props.
 * @returns Rendered radio group.
 */
export function SduiRadioGroup({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const options = propArr(component.props, "options") as RadioOption[];
  const initialValue = propStr(component.props, "value");
  const [selected, setSelected] = useState(initialValue);

  return (
    <View style={styles.radioGroupContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioOption}
          onPress={() => setSelected(option.value)}
        >
          <View
            style={[
              styles.radioCircle,
              {
                borderColor:
                  selected === option.value
                    ? theme.colors.accent
                    : theme.colors.secondary,
              },
            ]}
          >
            {selected === option.value ? (
              <View
                style={[
                  styles.radioInner,
                  { backgroundColor: theme.colors.accent },
                ]}
              />
            ) : null}
          </View>
          <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
