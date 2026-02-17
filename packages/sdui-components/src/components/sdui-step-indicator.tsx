import { View, Text } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@workspace/sdui-sdk";
import type { SduiComponentProps } from "@workspace/sdui-sdk";
import { propArr, propNum } from "../prop-helpers";
import { styles } from "../styles";

/**
 * Multi-step progress indicator (e.g. checkout flow).
 * @param props - SDUI component props.
 * @returns Rendered step indicator.
 */
export function SduiStepIndicator({ component }: SduiComponentProps): ReactNode {
  const theme = useTheme();
  const steps = propArr(component.props, "steps") as string[];
  const currentStep = propNum(component.props, "currentStep");

  return (
    <View style={styles.stepIndicatorContainer}>
      {steps.map((label, i) => {
        const isActive = i <= currentStep;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
            <View
              style={[
                styles.stepIndicatorCircle,
                {
                  backgroundColor: isActive
                    ? theme.colors.accent
                    : theme.colors.secondary,
                },
              ]}
            >
              <Text style={styles.stepIndicatorNumber}>{i + 1}</Text>
            </View>
            {i < steps.length - 1 ? (
              <View
                style={[
                  styles.stepIndicatorLine,
                  {
                    backgroundColor:
                      i < currentStep
                        ? theme.colors.accent
                        : theme.colors.secondary,
                  },
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
