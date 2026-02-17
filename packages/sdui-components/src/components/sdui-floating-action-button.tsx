import { TouchableOpacity, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Floating action button (FAB) fixed at a corner of the screen.
 * @param props - SDUI component props.
 * @returns Rendered FAB.
 */
export function SduiFloatingActionButton({
  component,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const icon = propStr(component.props, "icon") || "+";
  const label = propStr(component.props, "label");
  const position = propStr(component.props, "position") || "bottom-right";
  const handleAction = useMobileAction();

  const positionStyle =
    position === "bottom-left"
      ? { bottom: 24, left: 24 }
      : { bottom: 24, right: 24 };

  return (
    <TouchableOpacity
      onPress={
        component.action ? () => handleAction(component.action) : undefined
      }
      style={[
        styles.fab,
        { backgroundColor: theme.colors.accent },
        positionStyle,
      ]}
    >
      <Text style={styles.fabIcon}>{icon}</Text>
      {label ? <Text style={styles.fabLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );
}
