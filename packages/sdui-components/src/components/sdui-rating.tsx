import { View, Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum, propBool } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Star rating display or interactive input.
 * @param props - SDUI component props.
 * @returns Rendered rating.
 */
export function SduiRating({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const value = propNum(component.props, "value");
  const maxStars = propNum(component.props, "maxStars") || 5;
  const size = propNum(component.props, "size") || 20;
  const interactive = propBool(component.props, "interactive");

  const stars = Array.from({ length: maxStars }, (_, i) => {
    const filled = i < Math.round(value);
    const star = (
      <Text
        key={i}
        style={[
          styles.ratingStar,
          {
            fontSize: size,
            color: filled ? theme.colors.accent : theme.colors.secondary,
          },
        ]}
      >
        {filled ? "★" : "☆"}
      </Text>
    );

    if (interactive) {
      return (
        <TouchableOpacity key={i}>
          {star}
        </TouchableOpacity>
      );
    }
    return star;
  });

  return <View style={styles.ratingContainer}>{stars}</View>;
}
