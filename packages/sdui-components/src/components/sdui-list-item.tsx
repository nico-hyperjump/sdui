import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * List item: title and optional subtitle.
 * @param props - SDUI component props.
 * @returns Rendered list item.
 */
export function SduiListItem({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const subtitle = propStr(component.props, "subtitle");
  return (
    <View
      style={[styles.listItem, { borderBottomColor: theme.colors.secondary }]}
    >
      <Text style={[styles.listItemTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.listItemSubtitle, { color: theme.colors.text }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
