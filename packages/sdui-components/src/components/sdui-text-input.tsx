import { View, Text, TextInput } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Text input field for forms with label and placeholder.
 * @param props - SDUI component props.
 * @returns Rendered text input.
 */
export function SduiTextInput({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label = propStr(component.props, "label");
  const placeholder = propStr(component.props, "placeholder");
  const inputType = propStr(component.props, "inputType") || "text";

  const keyboardType =
    inputType === "email"
      ? "email-address"
      : inputType === "phone"
        ? "phone-pad"
        : inputType === "number"
          ? "numeric"
          : "default";

  return (
    <View style={styles.textInputContainer}>
      {label ? (
        <Text style={[styles.textInputLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.secondary}
        keyboardType={keyboardType as "default" | "email-address" | "phone-pad" | "numeric"}
        secureTextEntry={inputType === "password"}
        style={[
          styles.textInputField,
          {
            color: theme.colors.text,
            borderColor: theme.colors.secondary,
            backgroundColor: theme.colors.background,
          },
        ]}
      />
    </View>
  );
}
