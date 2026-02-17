import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@workspace/sdui-sdk";

export interface ErrorScreenProps {
  /** Error message to display. */
  message: string;
  /** Callback when the user taps retry. */
  onRetry: () => void;
}

/**
 * Full-screen error display with message and retry button.
 * Styled with brand theme colors.
 */
export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
