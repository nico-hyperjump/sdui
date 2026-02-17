import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propNum, propArr } from "../prop-helpers";
import { styles } from "../styles";

interface TabItem {
  label: string;
}

/**
 * Horizontal tab bar that highlights the selected tab.
 * @param props - SDUI component props with children rendered per tab.
 * @returns Rendered tab bar.
 */
export function SduiTabBar({ component, children }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const tabs = propArr(component.props, "tabs") as TabItem[];
  const initialIndex = propNum(component.props, "selectedIndex");
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  return (
    <View>
      <View style={[styles.tabBar, { borderBottomColor: theme.colors.secondary }]}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={styles.tab}
            onPress={() => setSelectedIndex(i)}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    i === selectedIndex
                      ? theme.colors.accent
                      : theme.colors.text,
                },
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.tabIndicator,
                {
                  backgroundColor:
                    i === selectedIndex
                      ? theme.colors.accent
                      : "transparent",
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      {children}
    </View>
  );
}
