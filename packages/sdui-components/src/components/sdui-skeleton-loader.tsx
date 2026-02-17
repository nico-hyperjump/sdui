import { View } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Skeleton loader placeholder for loading states.
 * @param props - SDUI component props.
 * @returns Rendered skeleton.
 */
export function SduiSkeletonLoader({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const variant = propStr(component.props, "variant") || "text";
  const lines = propNum(component.props, "lines") || 3;

  if (variant === "image") {
    return (
      <View
        style={[styles.skeletonImage, { backgroundColor: theme.colors.secondary }]}
      />
    );
  }

  if (variant === "card") {
    return (
      <View
        style={[styles.skeletonCard, { backgroundColor: theme.colors.secondary }]}
      />
    );
  }

  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.skeletonLine,
            {
              backgroundColor: theme.colors.secondary,
              width: i === lines - 1 ? "60%" : "100%",
            },
          ]}
        />
      ))}
    </View>
  );
}
