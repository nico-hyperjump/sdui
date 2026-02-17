import { useCallback, useEffect, useState } from "react";
import type { SduiScreen } from "@workspace/sdui-schema";
import {
  useSduiClient,
  useCacheManager,
  useSduiBrand,
  useSduiUserId,
} from "../sdui-context";

const CACHE_KEY_PREFIX = "sdui-screen:";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Return type for useSduiScreen hook.
 */
export interface UseSduiScreenReturn {
  /** The screen data or null while loading / on error. */
  screen: SduiScreen | null;
  /** True while the screen is being fetched. */
  loading: boolean;
  /** Error from the last fetch, or null. */
  error: Error | null;
  /** Re-fetch the screen (bypasses cache). */
  refetch: () => void;
}

/**
 * Fetches a single SDUI screen by ID using the context client, with in-memory caching.
 * Uses brand and userSegment from SduiProvider for the request.
 * @param screenId - The screen identifier.
 * @returns screen, loading, error, and refetch.
 */
export function useSduiScreen(screenId: string): UseSduiScreenReturn {
  const client = useSduiClient();
  const cache = useCacheManager();
  const brand = useSduiBrand();
  const userId = useSduiUserId();
  const [screen, setScreen] = useState<SduiScreen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScreen = useCallback(
    (skipCache: boolean) => {
      const cacheKey = `${CACHE_KEY_PREFIX}${screenId}:${brand}:${userId ?? ""}`;
      if (!skipCache) {
        const cached = cache.get<SduiScreen>(cacheKey);
        if (cached) {
          setScreen(cached);
          setLoading(false);
          setError(null);
          return;
        }
      }
      setLoading(true);
      setError(null);
      client
        .fetchScreen(screenId, { brand, user_id: userId })
        .then((data) => {
          cache.set(cacheKey, data, DEFAULT_TTL_MS);
          setScreen(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error(String(err)));
          setScreen(null);
          setLoading(false);
        });
    },
    [client, cache, screenId, brand, userId],
  );

  useEffect(() => {
    fetchScreen(false);
  }, [fetchScreen]);

  const refetch = useCallback(() => {
    fetchScreen(true);
  }, [fetchScreen]);

  return { screen, loading, error, refetch };
}
