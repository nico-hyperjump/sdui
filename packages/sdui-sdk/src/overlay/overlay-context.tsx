import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Value provided by the OverlayContext. */
export interface OverlayContextValue {
  /** Show an overlay by its id. */
  showOverlay: (id: string) => void;
  /** Dismiss an overlay by id, or the most recently shown overlay when id is omitted. */
  dismissOverlay: (id?: string) => void;
  /** Dismiss all visible overlays. */
  dismissAll: () => void;
  /** Check whether a given overlay id is currently visible. */
  isVisible: (id: string) => boolean;
  /** Ordered list of currently visible overlay ids (oldest first). */
  visibleOverlays: string[];
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/** React context that manages screen-level overlay visibility state. */
export const OverlayContext = createContext<OverlayContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface OverlayProviderProps {
  /** Child components. */
  children: ReactNode;
}

/**
 * Manages visibility state for screen-level overlays. Wrap the SDUI renderer
 * tree in this provider so that `useOverlay()` and `useActionHandler()` can
 * show and dismiss overlays.
 *
 * @param props - children to render inside the provider.
 * @returns The provider element wrapping children.
 */
export function OverlayProvider({ children }: OverlayProviderProps): ReactNode {
  const [visible, setVisible] = useState<string[]>([]);

  const showOverlay = useCallback((id: string) => {
    setVisible((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const dismissOverlay = useCallback((id?: string) => {
    setVisible((prev) => {
      if (prev.length === 0) return prev;
      const target = id ?? prev[prev.length - 1];
      return prev.filter((v) => v !== target);
    });
  }, []);

  const dismissAll = useCallback(() => {
    setVisible([]);
  }, []);

  const isVisible = useCallback(
    (id: string) => visible.includes(id),
    [visible],
  );

  const value = useMemo<OverlayContextValue>(
    () => ({
      showOverlay,
      dismissOverlay,
      dismissAll,
      isVisible,
      visibleOverlays: visible,
    }),
    [showOverlay, dismissOverlay, dismissAll, isVisible, visible],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook to access overlay visibility controls from OverlayContext.
 * Must be used inside an `<OverlayProvider>`.
 *
 * @returns Functions to show, dismiss, and query overlay visibility.
 * @throws When called outside of an OverlayProvider.
 */
export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return ctx;
}
