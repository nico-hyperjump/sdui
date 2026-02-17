import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propArr } from "../prop-helpers";
import { styles } from "../styles";

interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Dropdown select with options list.
 * @param props - SDUI component props.
 * @returns Rendered dropdown.
 */
export function SduiDropdown({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label = propStr(component.props, "label");
  const selectedValue = propStr(component.props, "selectedValue");
  const options = propArr(component.props, "options") as DropdownOption[];
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);
  const displayText = selectedOption?.label ?? "Select...";

  return (
    <View style={styles.dropdownContainer}>
      {label ? (
        <Text style={[styles.dropdownLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={[
          styles.dropdownButton,
          {
            borderColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Text style={[styles.dropdownButtonText, { color: theme.colors.text }]}>
          {displayText}
        </Text>
        <Text style={[styles.dropdownArrow, { color: theme.colors.text }]}>
          {open ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.dropdownMenu,
            {
              borderColor: theme.colors.secondary,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                selectedValue === option.value
                  ? { backgroundColor: theme.colors.secondary }
                  : undefined,
              ]}
              onPress={() => setOpen(false)}
            >
              <Text
                style={[styles.dropdownOptionText, { color: theme.colors.text }]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
