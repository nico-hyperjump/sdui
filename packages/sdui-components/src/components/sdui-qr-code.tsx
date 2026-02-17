import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * QR code display placeholder. In production, use a QR rendering library.
 * @param props - SDUI component props.
 * @returns Rendered QR code placeholder.
 */
export function SduiQrCode({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const value = propStr(component.props, "value");
  const size = propNum(component.props, "size") || 160;

  return (
    <View style={styles.qrCodeContainer}>
      <View
        style={[
          styles.qrCodePlaceholder,
          {
            width: size,
            height: size,
            borderColor: theme.colors.secondary,
          },
        ]}
      >
        <Text style={{ color: theme.colors.text, fontSize: 32 }}>⬛</Text>
      </View>
      {value ? (
        <Text style={[styles.qrCodeText, { color: theme.colors.text }]}>
          {value}
        </Text>
      ) : null}
    </View>
  );
}
