import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Action card: tappable card that navigates, opens a URL, or shows an overlay when pressed.
 * @param props - SDUI component props with optional children.
 * @returns Rendered action card.
 */
export function SduiActionCard({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const handleAction = useMobileAction();

  const content = (
    <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
      {title ? (
        <Text style={[styles.text, { color: theme.colors.text }]}>{title}</Text>
      ) : null}
      {children}
    </View>
  );

  if (component.action) {
    return (
      <TouchableOpacity onPress={() => handleAction(component.action)}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}
