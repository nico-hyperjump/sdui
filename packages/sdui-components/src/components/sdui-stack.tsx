import { View } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Stack layout: vertical list of children with optional spacing.
 * @param props - SDUI component props with children.
 * @returns Rendered stack layout.
 */
export function SduiStack({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const gap = propNum(component.props, "gap") || 8;
  return <View style={[styles.stack, { gap }]}>{children}</View>;
}
