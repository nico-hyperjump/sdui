import { View } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Row layout: horizontal list of children.
 * @param props - SDUI component props with children.
 * @returns Rendered row layout.
 */
export function SduiRow({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const gap = propNum(component.props, "gap") || 8;
  return <View style={[styles.row, { gap }]}>{children}</View>;
}
