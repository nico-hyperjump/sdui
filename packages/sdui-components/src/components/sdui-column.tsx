import { View } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Column layout: vertical list of children.
 * @param props - SDUI component props with children.
 * @returns Rendered column layout.
 */
export function SduiColumn({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const gap = propNum(component.props, "gap") || 8;
  return <View style={[styles.column, { gap }]}>{children}</View>;
}
