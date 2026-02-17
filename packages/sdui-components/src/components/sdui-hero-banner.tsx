import { View, Text, Image, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Hero banner: large image with optional title and subtitle.
 * @param props - SDUI component props with optional children.
 * @returns Rendered hero banner.
 */
export function SduiHeroBanner({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const subtitle = propStr(component.props, "subtitle");
  const imageUri =
    propStr(component.props, "imageUri") || propStr(component.props, "image");
  return (
    <View
      style={[styles.heroBanner, { backgroundColor: theme.colors.secondary }]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri } as ImageSourcePropType}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : null}
      {(title || subtitle) && (
        <View style={styles.heroText}>
          {title ? (
            <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={[styles.heroSubtitle, { color: theme.colors.text }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}
      {children}
    </View>
  );
}
