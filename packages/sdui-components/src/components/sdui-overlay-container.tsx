import { View, Modal, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { OverlayContainerProps } from "@workspace/sdui-sdk";
import { styles } from "../styles";

/**
 * Platform-specific overlay container that wraps content in a React Native Modal.
 * Supports three visual styles: centred modal, bottom sheet, and fullscreen.
 *
 * @param props - style, dismissible, visible, onDismiss, and children.
 * @returns A Modal element (renders nothing when `visible` is false).
 */
export function SduiOverlayContainer({
  style,
  dismissible,
  visible,
  onDismiss,
  children,
}: OverlayContainerProps): ReactNode {
  const theme = useTheme();

  if (!visible) return null;

  const handleBackdropPress = (): void => {
    if (dismissible) onDismiss();
  };

  if (style === "bottom_sheet") {
    return (
      <Modal transparent animationType="slide" visible={visible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBackdropPress}
          style={styles.bottomSheetOverlay}
        >
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
      </Modal>
    );
  }

  if (style === "fullscreen") {
    return (
      <Modal animationType="slide" visible={visible}>
        <View
          style={[
            styles.overlayFullscreen,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {children}
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleBackdropPress}
        style={styles.overlayModalCenter}
      >
        <TouchableOpacity activeOpacity={1}>
          <View
            style={[
              styles.overlayModalCard,
              { backgroundColor: theme.colors.background },
            ]}
          >
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
