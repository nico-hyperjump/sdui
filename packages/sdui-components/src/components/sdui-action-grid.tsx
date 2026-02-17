import { View } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Action grid: list of tappable items arranged in a wrapped row (e.g. icon + label).
 * @param props - SDUI component props with children.
 * @returns Rendered action grid.
 */
export function SduiActionGrid({ children }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  return (
    <View
      style={[styles.actionGrid, { backgroundColor: theme.colors.secondary }]}
    >
      {children}
    </View>
  );
}
