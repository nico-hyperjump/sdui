import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import Constants from "expo-constants";
import { useSduiClient, useTheme } from "@workspace/sdui-sdk";
import type { GetConfigResponse } from "@workspace/sdui-schema";
import { getBrandConfig } from "@/lib/brand-config";

/**
 * Settings tab. Displays app version, server connection status, brand info,
 * feature flags from config, and debug info (API endpoint, brand ID, user segment).
 */
export default function SettingsScreen() {
  const theme = useTheme();
  const client = useSduiClient();
  const brandConfig = getBrandConfig();
  const [config, setConfig] = useState<GetConfigResponse | null>(null);
  const [configError, setConfigError] = useState<Error | null>(null);

  const loadConfig = useCallback(() => {
    setConfigError(null);
    client
      .fetchConfig(brandConfig.brandId)
      .then(setConfig)
      .catch((err) => setConfigError(err instanceof Error ? err : new Error(String(err))));
  }, [client, brandConfig.brandId]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const version =
    Constants.expoConfig?.version ?? Constants.manifest?.version ?? "1.0.0";
  const connected = config != null && configError == null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          App
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Version
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {version}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Server
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Connection
            </Text>
            {config == null && configError == null ? (
              <ActivityIndicator size="small" color={theme.colors.accent} />
            ) : (
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: connected ? "#22c55e" : "#ef4444" },
                ]}
              />
            )}
          </View>
          {configError && (
            <Text style={[styles.errorText, { color: theme.colors.accent }]}>
              {configError.message}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Brand
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {brandConfig.name}
          </Text>
        </View>
      </View>

      {config?.featureFlags && Object.keys(config.featureFlags).length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Feature flags
          </Text>
          <View
            style={[styles.card, { backgroundColor: theme.colors.secondary }]}
          >
            {Object.entries(config.featureFlags).map(([key, value]) => (
              <View key={key} style={styles.flagRow}>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                  {key}
                </Text>
                <Text
                  style={[
                    styles.flagValue,
                    { color: value ? theme.colors.accent : theme.colors.text },
                  ]}
                >
                  {value ? "On" : "Off"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Debug
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.secondary }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            API endpoint
          </Text>
          <Text
            style={[styles.value, styles.mono, { color: theme.colors.text }]}
            selectable
          >
            {brandConfig.serviceUrl}
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Brand ID
          </Text>
          <Text
            style={[styles.value, styles.mono, { color: theme.colors.text }]}
          >
            {brandConfig.brandId}
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            User segment
          </Text>
          <Text
            style={[styles.value, styles.mono, { color: theme.colors.text }]}
          >
            —
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
  mono: {
    fontFamily: "monospace",
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  flagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  flagValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
