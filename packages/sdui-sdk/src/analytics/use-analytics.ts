import { useCallback } from "react";
import type { AnalyticsEventInput } from "@workspace/sdui-schema";
import { useSduiClient, useSduiBrand } from "../sdui-context";

/**
 * Return type for the useAnalytics hook.
 */
export interface UseAnalyticsReturn {
  /** Send a raw analytics event. */
  trackEvent: (event: Omit<AnalyticsEventInput, "brand"> & { brand?: string }) => Promise<void>;
  /** Track a screen view. */
  trackScreenView: (screenId: string, payload?: Record<string, unknown>) => Promise<void>;
  /** Track an impression. */
  trackImpression: (screenId: string, payload?: Record<string, unknown>) => Promise<void>;
  /** Track a button click. */
  trackButtonClick: (screenId: string, payload?: Record<string, unknown>) => Promise<void>;
}

/**
 * Hook that provides analytics helpers backed by SduiClient from context.
 * Events are sent via the SDK client's trackEvent method.
 * @param brandOverride - Optional brand override; otherwise uses brand from SduiProvider.
 * @returns Object with trackEvent, trackScreenView, trackImpression, trackButtonClick.
 */
export function useAnalytics(brandOverride?: string): UseAnalyticsReturn {
  const client = useSduiClient();
  const contextBrand = useSduiBrand();
  const brand = brandOverride ?? contextBrand;

  const trackEvent = useCallback(
    async (
      event: Omit<AnalyticsEventInput, "brand"> & { brand?: string },
    ): Promise<void> => {
      const b = event.brand ?? brand ?? "";
      await client.trackEvent({
        ...event,
        brand: b,
      } as AnalyticsEventInput);
    },
    [client, brand],
  );

  const trackScreenView = useCallback(
    async (
      screenId: string,
      payload?: Record<string, unknown>,
    ): Promise<void> => {
      await trackEvent({
        eventType: "screen_view",
        brand,
        screenId,
        payload,
      });
    },
    [trackEvent, brand],
  );

  const trackImpression = useCallback(
    async (
      screenId: string,
      payload?: Record<string, unknown>,
    ): Promise<void> => {
      await trackEvent({
        eventType: "impression",
        brand,
        screenId,
        payload,
      });
    },
    [trackEvent, brand],
  );

  const trackButtonClick = useCallback(
    async (
      screenId: string,
      payload?: Record<string, unknown>,
    ): Promise<void> => {
      await trackEvent({
        eventType: "button_click",
        brand,
        screenId,
        payload,
      });
    },
    [trackEvent, brand],
  );

  return {
    trackEvent,
    trackScreenView,
    trackImpression,
    trackButtonClick,
  };
}
