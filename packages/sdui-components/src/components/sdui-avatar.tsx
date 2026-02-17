import { View, Text, Image, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Circular avatar with image or fallback initials.
 * @param props - SDUI component props.
 * @returns Rendered avatar.
 */
export function SduiAvatar({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const uri = propStr(component.props, "uri") || propStr(component.props, "image");
  const size = propNum(component.props, "size") || 48;
  const fallbackInitials = propStr(component.props, "fallbackInitials");

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          backgroundColor: theme.colors.secondary,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri } as ImageSourcePropType}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.avatarInitials,
            { color: theme.colors.text, fontSize: size * 0.4 },
          ]}
        >
          {fallbackInitials}
        </Text>
      )}
    </View>
  );
}
