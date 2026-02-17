import { ScrollView } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Pull-to-refresh wrapper around a scrollable container.
 * In production, connect the refresh action to re-fetch screen data.
 * @param props - SDUI component props with children.
 * @returns Rendered pull-to-refresh container.
 */
export function SduiPullToRefresh({ children }: SduiComponentProps): ReactNode {
  return (
    <ScrollView style={styles.pullToRefresh}>{children}</ScrollView>
  );
}
