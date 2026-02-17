import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Accordion: expandable/collapsible section with title header.
 * @param props - SDUI component props with children for expanded content.
 * @returns Rendered accordion.
 */
export function SduiAccordion({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const initialExpanded = propBool(component.props, "expanded");
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <View
      style={[
        styles.accordionContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={[
          styles.accordionHeader,
          { borderBottomWidth: expanded ? 1 : 0, borderBottomColor: theme.colors.secondary },
        ]}
      >
        <Text style={[styles.accordionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.accordionArrow, { color: theme.colors.text }]}>
          {expanded ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {expanded ? <View style={styles.accordionBody}>{children}</View> : null}
    </View>
  );
}
