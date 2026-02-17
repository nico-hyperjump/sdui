import { View, FlatList, type LayoutChangeEvent } from "react-native";
import { useState, useEffect, useCallback, useRef, Children } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propBool, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Carousel: horizontally swipeable pane with optional auto-play and indicators.
 * Measures its own container width via onLayout so that item widths and paging
 * always match the actual rendered size (safe-area / padding agnostic).
 * @param props - SDUI component props with optional children.
 * @returns Rendered carousel.
 */
export function SduiCarousel({
  component,
  children,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const autoPlay = propBool(component.props, "autoPlay");
  const interval = propNum(component.props, "interval") || 3000;
  const showIndicators = component.props?.["showIndicators"] !== false;
  const loop = propBool(component.props, "loop");
  const childCount = component.children?.length ?? 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeIndexRef = useRef(0);
  const childArray = Children.toArray(children);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    if (!autoPlay || childCount <= 1 || containerWidth === 0) return;
    const timer = setInterval(() => {
      const prev = activeIndexRef.current;
      const next = prev + 1;
      const newIndex = loop || next < childCount ? next % childCount : prev;
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToOffset({
        offset: newIndex * containerWidth,
        animated: true,
      });
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, loop, childCount, containerWidth]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth],
  );

  const baseStyle = [
    styles.carousel,
    { backgroundColor: theme.colors.background },
  ];

  if (containerWidth === 0) {
    return <View style={baseStyle} onLayout={onLayout} />;
  }

  return (
    <View style={baseStyle} onLayout={onLayout}>
      <FlatList
        ref={flatListRef}
        data={component.children ?? []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        renderItem={({ index }) => (
          <View style={{ width: containerWidth }}>{childArray[index]}</View>
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / containerWidth,
          );
          activeIndexRef.current = idx;
          setActiveIndex(idx);
        }}
      />
      {showIndicators && childCount > 1 && (
        <View style={styles.carouselIndicatorRow}>
          {Array.from({ length: childCount }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.carouselDot,
                {
                  backgroundColor:
                    i === activeIndex
                      ? theme.colors.accent
                      : theme.colors.secondary,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}
