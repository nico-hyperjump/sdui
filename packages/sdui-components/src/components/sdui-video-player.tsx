import { View, Text, Image, TouchableOpacity, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Video player placeholder with poster image and play button overlay.
 * In production, replace the placeholder with a real video player (e.g. expo-av).
 * @param props - SDUI component props.
 * @returns Rendered video player placeholder.
 */
export function SduiVideoPlayer({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const uri = propStr(component.props, "uri") || propStr(component.props, "src");
  const poster = propStr(component.props, "poster");
  const aspectRatio = propNum(component.props, "aspectRatio") || 16 / 9;

  return (
    <View
      style={[
        styles.videoPlayer,
        {
          backgroundColor: theme.colors.secondary,
          aspectRatio,
        },
      ]}
    >
      {poster ? (
        <Image
          source={{ uri: poster } as ImageSourcePropType}
          style={styles.videoPoster}
          resizeMode="cover"
        />
      ) : null}
      <View style={styles.videoOverlay}>
        <TouchableOpacity>
          <Text style={styles.videoPlayButton}>▶</Text>
        </TouchableOpacity>
      </View>
      {uri ? null : (
        <Text style={{ color: theme.colors.text, opacity: 0.5, fontSize: 14 }}>
          Video Player
        </Text>
      )}
    </View>
  );
}
