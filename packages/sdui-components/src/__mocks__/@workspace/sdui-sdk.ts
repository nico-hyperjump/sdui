/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

/** Minimal @workspace/sdui-sdk mock for unit tests. */
export function useTheme() {
  return {
    colors: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
      text: "#000000",
    },
    typography: {
      fontFamily: "System",
      headingWeight: "bold",
      bodyWeight: "normal",
    },
    assets: { logo: "" },
  };
}

/**
 * Minimal ComponentRegistry mock that stores type -> component mappings.
 */
export class ComponentRegistry {
  private readonly map = new Map<string, unknown>();

  /** Creates a ComponentRegistry from a type-safe map object. */
  static fromMap(map: Record<string, unknown>): ComponentRegistry {
    const registry = new ComponentRegistry();
    for (const [type, component] of Object.entries(map)) {
      registry.register(type, component);
    }
    return registry;
  }

  /** Registers a component for a given type. */
  register(type: string, component: unknown): void {
    this.map.set(type, component);
  }

  /** Returns the component for a given type, or undefined. */
  get(type: string): unknown {
    return this.map.get(type);
  }
}

/** Mock overlay context — all operations are no-ops. */
export function useOverlay() {
  return {
    showOverlay: () => {},
    dismissOverlay: () => {},
    dismissAll: () => {},
    isVisible: () => false,
    visibleOverlays: [] as string[],
  };
}

/** Mock OverlayProvider — passes children through. */
export function OverlayProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}

/** Mock useActionHandler — returns a no-op dispatch function. */
export function useActionHandler(): (action: any) => void {
  return () => {};
}
