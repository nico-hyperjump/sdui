import { View } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Card container with optional padding and background.
 * @param props - SDUI component props with children.
 * @returns Rendered card view.
 */
export function SduiCard({ children }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
      {children}
    </View>
  );
}
