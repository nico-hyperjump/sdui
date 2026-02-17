import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propStr } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Computes remaining time segments from a target date.
 * @param endTime - ISO date string for the countdown target.
 * @returns Object with days, hours, minutes, seconds remaining.
 */
function getTimeRemaining(endTime: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const total = Math.max(0, new Date(endTime).getTime() - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

/**
 * Live countdown timer that ticks every second until an end time.
 * @param props - SDUI component props.
 * @returns Rendered countdown timer.
 */
export function SduiCountdownTimer({
  component,
}: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const endTime = propStr(component.props, "endTime");
  const label = propStr(component.props, "label");
  const [remaining, setRemaining] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const segments: { value: number; unit: string }[] = [
    { value: remaining.days, unit: "D" },
    { value: remaining.hours, unit: "H" },
    { value: remaining.minutes, unit: "M" },
    { value: remaining.seconds, unit: "S" },
  ];

  return (
    <View style={styles.countdownContainer}>
      {label ? (
        <Text style={[styles.countdownLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      ) : null}
      {segments.map((seg, i) => (
        <View key={seg.unit} style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.countdownSegment,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text style={styles.countdownValue}>
              {String(seg.value).padStart(2, "0")}
            </Text>
            <Text style={styles.countdownUnit}>{seg.unit}</Text>
          </View>
          {i < segments.length - 1 ? (
            <Text style={[styles.countdownSeparator, { color: theme.colors.text }]}>
              :
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
