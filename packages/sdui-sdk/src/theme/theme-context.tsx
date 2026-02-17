import { createContext, useContext, type ReactNode } from "react";
import type { BrandTheme } from "@workspace/sdui-schema";

/** Default theme when none is provided (avoids null). */
const defaultTheme: BrandTheme = {
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
  assets: {
    logo: "",
    appIcon: undefined,
  },
};

/** React context holding the current brand theme. */
export const ThemeContext = createContext<BrandTheme>(defaultTheme);

export interface ThemeProviderProps {
  /** The brand theme to provide. */
  theme: BrandTheme;
  /** Child components. */
  children: ReactNode;
}

/**
 * Provides the brand theme to the tree. Use useTheme() to read it.
 * @param props - theme and children.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps): ReactNode {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access the current brand theme from ThemeContext.
 * @returns The current BrandTheme.
 */
export function useTheme(): BrandTheme {
  return useContext(ThemeContext);
}
