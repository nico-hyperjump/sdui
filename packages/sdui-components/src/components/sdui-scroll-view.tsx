import { ScrollView } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Scrollable container for children.
 * @param props - SDUI component props with children.
 * @returns Rendered scroll view.
 */
export function SduiScrollView({ children }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: theme.colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
