import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propArr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Comparison table for side-by-side feature/plan comparison.
 * @param props - SDUI component props.
 * @returns Rendered comparison table.
 */
export function SduiComparisonTable({
  component,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const columns = propArr(component.props, "columns") as string[];
  const rows = propArr(component.props, "rows") as string[][];
  const highlightedColumn = propNum(component.props, "highlightedColumn");

  return (
    <View style={[styles.comparisonTable, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.comparisonHeaderRow, { backgroundColor: theme.colors.secondary }]}>
        {columns.map((col, i) => (
          <View
            key={i}
            style={[
              styles.comparisonHeaderCell,
              i === highlightedColumn
                ? { backgroundColor: theme.colors.accent }
                : undefined,
            ]}
          >
            <Text
              style={[
                styles.comparisonHeaderText,
                {
                  color:
                    i === highlightedColumn ? "#ffffff" : theme.colors.text,
                },
              ]}
            >
              {col}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={[
            styles.comparisonRow,
            { borderTopColor: theme.colors.secondary },
          ]}
        >
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={[
                styles.comparisonCell,
                ci === highlightedColumn
                  ? { backgroundColor: `${theme.colors.accent}15` }
                  : undefined,
              ]}
            >
              <Text style={[styles.comparisonCellText, { color: theme.colors.text }]}>
                {cell}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
