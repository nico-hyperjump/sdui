import { View, Text, Image, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Product card: image, title, price, and optional badge.
 * @param props - SDUI component props.
 * @returns Rendered product card.
 */
export function SduiProductCard({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const title = propStr(component.props, "title");
  const price = propStr(component.props, "price");
  const imageUri =
    propStr(component.props, "imageUri") || propStr(component.props, "image");
  const badge = propStr(component.props, "badge");
  return (
    <View
      style={[styles.productCard, { backgroundColor: theme.colors.secondary }]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri } as ImageSourcePropType}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : null}
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Text style={[styles.productTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.productPrice, { color: theme.colors.accent }]}>
        {price}
      </Text>
    </View>
  );
}
