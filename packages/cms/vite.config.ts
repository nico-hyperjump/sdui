import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration for the CMS admin panel.
 * Base path is /admin for deployment under the main app.
 */
export default defineConfig({
  plugins: [react()],
  base: "/admin",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
