import { Text, TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";
import { useMobileAction } from "../hooks/use-mobile-action";

/**
 * Tappable search bar that navigates to a search screen on press.
 * @param props - SDUI component props.
 * @returns Rendered search bar.
 */
export function SduiSearchBar({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const placeholder = propStr(component.props, "placeholder") || "Search...";
  const handleAction = useMobileAction();

  return (
    <TouchableOpacity
      onPress={
        component.action ? () => handleAction(component.action) : undefined
      }
      style={[styles.searchBar, { backgroundColor: theme.colors.secondary }]}
    >
      <Text style={styles.searchBarIcon}>🔍</Text>
      <Text style={[styles.searchBarPlaceholder, { color: theme.colors.text }]}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
}
