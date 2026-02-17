import { View, Modal, TouchableOpacity } from "react-native";
import { useState, useCallback, type ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Bottom sheet overlay container that slides up from the bottom.
 * Uses React Native Modal under the hood. Tapping the backdrop dismisses
 * the sheet unless the `dismissible` prop is set to `false`.
 * @param props - SDUI component props with children for sheet content.
 * @returns Rendered bottom sheet, or `null` once dismissed.
 */
export function SduiBottomSheet({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const dismissible = component.props?.["dismissible"] !== false;
  const [visible, setVisible] = useState(true);

  const handleBackdropPress = useCallback((): void => {
    if (dismissible) setVisible(false);
  }, [dismissible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleBackdropPress}
        style={styles.bottomSheetOverlay}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={[
              styles.bottomSheetContent,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View
              style={[
                styles.bottomSheetHandle,
                { backgroundColor: theme.colors.text },
              ]}
            />
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
