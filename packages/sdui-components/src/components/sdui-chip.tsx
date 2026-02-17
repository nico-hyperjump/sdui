import { TouchableOpacity, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Chip/tag: small label for filters, categories, or statuses.
 * @param props - SDUI component props.
 * @returns Rendered chip.
 */
export function SduiChip({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label =
    propStr(component.props, "label") || propStr(component.props, "text");
  const variant = propStr(component.props, "variant") || "filled";
  const selected = propBool(component.props, "selected");
  const handleAction = useMobileAction();

  const isFilled = variant === "filled" || selected;

  return (
    <TouchableOpacity
      onPress={
        component.action ? () => handleAction(component.action) : undefined
      }
      style={[
        styles.chip,
        {
          backgroundColor: isFilled ? theme.colors.accent : "transparent",
          borderColor: isFilled ? theme.colors.accent : theme.colors.secondary,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          { color: isFilled ? "#ffffff" : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
