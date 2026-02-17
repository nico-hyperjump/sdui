import { Image, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Image component. Reads uri or src from props.
 * @param props - SDUI component props.
 * @returns Rendered image or null if no URI provided.
 */
export function SduiImage({ component }: SduiComponentProps): ReactNode {
  const uri =
    propStr(component.props, "uri") || propStr(component.props, "src") || "";
  if (!uri) return null;
  const width = propNum(component.props, "width") || undefined;
  const height = propNum(component.props, "height") || undefined;
  return (
    <Image
      source={{ uri } as ImageSourcePropType}
      style={[
        styles.image,
        width ? { width } : undefined,
        height ? { height } : undefined,
      ]}
      resizeMode="cover"
    />
  );
}
