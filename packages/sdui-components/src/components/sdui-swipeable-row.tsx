import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propArr } from "../prop-helpers";
import { styles } from "../styles";

interface SwipeAction {
  label: string;
  color: string;
}

/**
 * Swipeable row with hidden action buttons (e.g. delete, archive).
 * This is a visual placeholder; real swipe gestures need react-native-gesture-handler.
 * @param props - SDUI component props with children.
 * @returns Rendered swipeable row.
 */
export function SduiSwipeableRow({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const rightActions = propArr(component.props, "rightActions") as SwipeAction[];

  return (
    <View style={styles.swipeableRow}>
      <View style={styles.swipeableContent}>{children}</View>
      {rightActions.length > 0 && (
        <View style={styles.swipeableActions}>
          {rightActions.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.swipeableActionButton,
                { backgroundColor: action.color || theme.colors.accent },
              ]}
            >
              <Text style={styles.swipeableActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
