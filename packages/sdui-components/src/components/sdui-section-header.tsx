import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Section header with title, optional subtitle, and optional "See All" action.
 * @param props - SDUI component props.
 * @returns Rendered section header.
 */
export function SduiSectionHeader({
  component,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const subtitle = propStr(component.props, "subtitle");
  const actionLabel = propStr(component.props, "actionLabel") || "See All";
  const handleAction = useMobileAction();

  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.sectionSubtitle, { color: theme.colors.text }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {component.action ? (
        <TouchableOpacity onPress={() => handleAction(component.action)}>
          <Text style={[styles.sectionAction, { color: theme.colors.accent }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
