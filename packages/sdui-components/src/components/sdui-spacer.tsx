import { View } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";

/**
 * Vertical spacer with optional size.
 * @param props - SDUI component props.
 * @returns Rendered spacer view.
 */
export function SduiSpacer({ component }: SduiComponentProps): ReactNode {
  const height =
    propNum(component.props, "height") ||
    propNum(component.props, "size") ||
    16;
  return <View style={{ height }} />;
}
