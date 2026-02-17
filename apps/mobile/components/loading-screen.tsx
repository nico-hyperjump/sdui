import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@workspace/sdui-sdk";

/**
 * Full-screen loading spinner. Uses brand theme accent color.
 */
export function LoadingScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
