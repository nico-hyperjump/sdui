import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum, propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Map view placeholder. In production, replace with react-native-maps.
 * @param props - SDUI component props.
 * @returns Rendered map placeholder.
 */
export function SduiMapView({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const latitude = propNum(component.props, "latitude");
  const longitude = propNum(component.props, "longitude");
  const mapStyle = propStr(component.props, "style") || "standard";

  return (
    <View style={[styles.mapView, { backgroundColor: theme.colors.secondary }]}>
      <Text style={[styles.mapPlaceholderText, { color: theme.colors.text }]}>
        Map ({mapStyle})
      </Text>
      <Text style={[styles.mapPlaceholderText, { color: theme.colors.text }]}>
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </Text>
    </View>
  );
}
