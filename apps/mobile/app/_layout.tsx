import { Stack } from "expo-router";
import { useMemo } from "react";
import { SduiProvider } from "@workspace/sdui-sdk";
import { getBrandConfig } from "@/lib/brand-config";

/**
 * Demo user ID used for data resolution (e.g. account source).
 * In production this would come from authentication state.
 */
const DEMO_USER_ID = "user-1";

/**
 * Root layout. Wraps the entire app in SduiProvider with brand config
 * (serviceUrl, apiKey, brand, userId) so all screens can use SDUI hooks and renderer.
 */
export default function RootLayout() {
  const brandConfig = useMemo(() => getBrandConfig(), []);

  return (
    <SduiProvider
      serviceUrl={brandConfig.serviceUrl}
      apiKey={brandConfig.apiKey}
      brand={brandConfig.brandId}
      userId={DEMO_USER_ID}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SduiProvider>
  );
}
