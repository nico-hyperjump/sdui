import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BrandTheme } from "@workspace/sdui-schema";
import { SduiClient } from "./client/sdui-client";
import { CacheManager } from "./client/cache-manager";
import { ThemeProvider } from "./theme/theme-context";

/**
 * Value provided by SduiContext (client, cache, and optional request params).
 */
export interface SduiContextValue {
  client: SduiClient;
  cacheManager: CacheManager;
  brand: string;
  userSegment?: string;
  userId?: string;
}

/** React context holding the SDK client and cache manager. */
export const SduiContext = createContext<SduiContextValue | null>(null);

export interface SduiProviderProps {
  /** Base URL of the SDUI service. */
  serviceUrl: string;
  /** API key for the service. */
  apiKey: string;
  /** Brand identifier (used for config fetch and requests). */
  brand: string;
  /** Optional user segment for personalization. */
  userSegment?: string;
  /** Optional user ID for per-user data resolution (e.g. account data). */
  userId?: string;
  /** Child components. */
  children: ReactNode;
}

interface ThemeWrapperProps {
  theme: BrandTheme;
  children: ReactNode;
}

function ThemeWrapper({ theme, children }: ThemeWrapperProps): ReactNode {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

/**
 * Root SDK provider. Creates SduiClient and CacheManager, fetches brand config on mount,
 * and provides theme via ThemeProvider. Children can use useSduiClient and useTheme.
 * @param props - serviceUrl, apiKey, brand, optional userSegment, children.
 */
export function SduiProvider({
  serviceUrl,
  apiKey,
  brand,
  userSegment,
  userId,
  children,
}: SduiProviderProps): ReactNode {
  const [theme, setTheme] = useState<BrandTheme | null>(null);

  const value = useMemo(() => {
    const client = new SduiClient({ serviceUrl, apiKey });
    const cacheManager = new CacheManager();
    return { client, cacheManager, brand, userSegment, userId };
  }, [serviceUrl, apiKey, brand, userSegment, userId]);

  useEffect(() => {
    let cancelled = false;
    value.client
      .fetchConfig(brand)
      .then((config) => {
        if (!cancelled) setTheme(config.theme);
      })
      .catch(() => {
        if (!cancelled) setTheme(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value.client, brand]);

  const content =
    theme != null ? (
      <ThemeWrapper theme={theme}>{children}</ThemeWrapper>
    ) : (
      children
    );

  return <SduiContext.Provider value={value}>{content}</SduiContext.Provider>;
}

/**
 * Hook to access the SDUI client from context. Throws if used outside SduiProvider.
 * @returns The SduiClient instance.
 */
export function useSduiClient(): SduiClient {
  const ctx = useContext(SduiContext);
  if (!ctx) {
    throw new Error("useSduiClient must be used within SduiProvider");
  }
  return ctx.client;
}

/**
 * Hook to access the current brand from context. Throws if used outside SduiProvider.
 * @returns The brand string.
 */
export function useSduiBrand(): string {
  const ctx = useContext(SduiContext);
  if (!ctx) {
    throw new Error("useSduiBrand must be used within SduiProvider");
  }
  return ctx.brand;
}

/**
 * Hook to access the cache manager from context. Throws if used outside SduiProvider.
 * @returns The CacheManager instance.
 */
export function useCacheManager(): CacheManager {
  const ctx = useContext(SduiContext);
  if (!ctx) {
    throw new Error("useCacheManager must be used within SduiProvider");
  }
  return ctx.cacheManager;
}

/**
 * Hook to access the current userId from context. Throws if used outside SduiProvider.
 * @returns The userId string or undefined.
 */
export function useSduiUserId(): string | undefined {
  const ctx = useContext(SduiContext);
  if (!ctx) {
    throw new Error("useSduiUserId must be used within SduiProvider");
  }
  return ctx.userId;
}
