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
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Empty state placeholder with image, title, subtitle, and optional CTA.
 * @param props - SDUI component props.
 * @returns Rendered empty state.
 */
export function SduiEmptyState({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const imageUri =
    propStr(component.props, "imageUri") || propStr(component.props, "image");
  const title = propStr(component.props, "title");
  const subtitle = propStr(component.props, "subtitle");
  const actionLabel = propStr(component.props, "actionLabel") || "Try Again";
  const handleAction = useMobileAction();

  return (
    <View style={styles.emptyState}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri } as ImageSourcePropType}
          style={styles.emptyStateImage}
          resizeMode="contain"
        />
      ) : null}
      {title ? (
        <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={[styles.emptyStateSubtitle, { color: theme.colors.text }]}>
          {subtitle}
        </Text>
      ) : null}
      {component.action ? (
        <TouchableOpacity
          onPress={() => handleAction(component.action)}
          style={[styles.button, { backgroundColor: theme.colors.accent }]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
