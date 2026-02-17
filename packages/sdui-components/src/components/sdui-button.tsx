import { TouchableOpacity, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Button component. Executes action on press (navigate, webview, overlay, or custom).
 * @param props - SDUI component props with optional children.
 * @returns Rendered touchable button.
 */
export function SduiButton({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label =
    propStr(component.props, "label") ||
    propStr(component.props, "title") ||
    propStr(component.props, "text") ||
    "Button";
  const handleAction = useMobileAction();

  return (
    <TouchableOpacity
      onPress={() => handleAction(component.action)}
      style={[styles.button, { backgroundColor: theme.colors.accent }]}
    >
      {children ?? <Text style={styles.buttonText}>{label}</Text>}
    </TouchableOpacity>
  );
}
