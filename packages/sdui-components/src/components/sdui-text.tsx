import { Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Text block. Reads content or text from props.
 * @param props - SDUI component props.
 * @returns Rendered text element.
 */
export function SduiText({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const content =
    propStr(component.props, "content") ||
    propStr(component.props, "text") ||
    "";
  const variant = propStr(component.props, "variant") || "body";
  const isHeading = variant === "heading" || variant === "title";
  return (
    <Text
      style={[
        styles.text,
        {
          color: theme.colors.text,
          fontSize: isHeading ? 20 : 16,
          fontWeight: isHeading ? "600" : "normal",
        },
      ]}
    >
      {content}
    </Text>
  );
}
