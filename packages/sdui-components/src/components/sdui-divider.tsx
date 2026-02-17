import { View } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Horizontal divider line.
 * @param props - SDUI component props.
 * @returns Rendered divider view.
 */
export function SduiDivider({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const thickness = propNum(component.props, "thickness") || 1;
  return (
    <View
      style={[
        styles.divider,
        { height: thickness, backgroundColor: theme.colors.secondary },
      ]}
    />
  );
}
