import { ScrollView, RefreshControl } from "react-native";
import { useCallback, useMemo } from "react";
import {
  useSduiScreen,
  SduiRenderer,
  useTheme,
} from "@workspace/sdui-sdk";
import { LoadingScreen } from "@/components/loading-screen";
import { ErrorScreen } from "@/components/error-screen";
import { mobileRegistry } from "@/components/sdui";

/**
 * Plans tab. Fetches the "plans" SDUI screen, shows loading/error states,
 * and renders content with SduiRenderer. Supports pull-to-refresh.
 */
export default function PlansScreen() {
  const { screen, loading, error, refetch } = useSduiScreen("plans");
  const theme = useTheme();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={loading}
        onRefresh={onRefresh}
        tintColor={theme.colors.accent}
      />
    ),
    [loading, onRefresh, theme.colors.accent],
  );

  if (loading && !screen) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!screen?.components?.length) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      refreshControl={refreshControl}
      contentContainerStyle={{ padding: 16 }}
    >
      <SduiRenderer components={screen.components} registry={mobileRegistry} />
    </ScrollView>
  );
}
