import { TouchableOpacity, Text, Linking } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Link component: text that opens a URL or navigates on press.
 * Falls back to the `href` prop when no explicit action is set.
 * @param props - SDUI component props.
 * @returns Rendered touchable link.
 */
export function SduiLink({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const label =
    propStr(component.props, "label") ||
    propStr(component.props, "text") ||
    "Link";
  const href =
    propStr(component.props, "href") || propStr(component.props, "url");
  const handleAction = useMobileAction();

  const onPress = (): void => {
    if (component.action) {
      handleAction(component.action);
    } else if (href) {
      void Linking.openURL(href);
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, { color: theme.colors.accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}
