import { View, Image, FlatList, type ImageSourcePropType } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propArr, propNum } from "../prop-helpers";
import { styles } from "../styles";

interface MediaItem {
  uri: string;
  type?: string;
}

/**
 * Horizontal media gallery for images/videos.
 * @param props - SDUI component props.
 * @returns Rendered media gallery.
 */
export function SduiMediaGallery({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const items = propArr(component.props, "items") as MediaItem[];
  const itemHeight = propNum(component.props, "height") || 200;

  return (
    <View style={styles.mediaGallery}>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View
            style={[
              styles.mediaGalleryItem,
              { backgroundColor: theme.colors.secondary },
            ]}
          >
            <Image
              source={{ uri: item.uri } as ImageSourcePropType}
              style={{ width: itemHeight * (16 / 9), height: itemHeight }}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}
