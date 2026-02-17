import {
  View,
  Text,
  Image,
  TouchableOpacity,
  type ImageSourcePropType,
} from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propBool } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Story circle: circular thumbnail that opens content on tap, like Instagram stories.
 * @param props - SDUI component props.
 * @returns Rendered story circle.
 */
export function SduiStoryCircle({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const imageUri =
    propStr(component.props, "imageUri") || propStr(component.props, "image");
  const label = propStr(component.props, "label");
  const seen = propBool(component.props, "seen");
  const handleAction = useMobileAction();

  return (
    <TouchableOpacity
      onPress={
        component.action ? () => handleAction(component.action) : undefined
      }
      style={styles.storyCircle}
    >
      <View
        style={[
          styles.storyCircleRing,
          {
            borderColor: seen ? theme.colors.secondary : theme.colors.accent,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri } as ImageSourcePropType}
            style={styles.storyCircleImage}
            resizeMode="cover"
          />
        ) : null}
      </View>
      {label ? (
        <Text
          style={[styles.storyCircleLabel, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
