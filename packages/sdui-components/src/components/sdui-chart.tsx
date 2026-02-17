import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr, propArr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Simple bar chart visualization.
 * @param props - SDUI component props.
 * @returns Rendered chart.
 */
export function SduiChart({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const chartType = propStr(component.props, "type") || "bar";
  const data = propArr(component.props, "data") as number[];
  const labels = propArr(component.props, "labels") as string[];
  const height = propNum(component.props, "height") || 120;
  const maxVal = Math.max(...data, 1);

  if (chartType !== "bar") {
    return (
      <View style={[styles.chartContainer, { height, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: theme.colors.text, opacity: 0.5 }}>
          {chartType} chart
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <View style={[styles.chartBarRow, { height }]}>
        {data.map((value, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={[
                styles.chartBar,
                {
                  backgroundColor: theme.colors.accent,
                  height: `${(value / maxVal) * 100}%`,
                },
              ]}
            />
            {labels[i] ? (
              <Text style={[styles.chartBarLabel, { color: theme.colors.text }]}>
                {labels[i]}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
