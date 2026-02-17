import { Image, Text, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Icon component. Renders as text placeholder or small image from props (name or uri).
 * @param props - SDUI component props.
 * @returns Rendered icon element.
 */
export function SduiIcon({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const name = propStr(component.props, "name");
  const uri = propStr(component.props, "uri");
  const size = propNum(component.props, "size") || 24;
  if (uri) {
    return (
      <Image
        source={{ uri } as ImageSourcePropType}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }
  return (
    <Text
      style={[
        styles.iconPlaceholder,
        { color: theme.colors.accent, fontSize: size },
      ]}
    >
      {name || "◆"}
    </Text>
  );
}
