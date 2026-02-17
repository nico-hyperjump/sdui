import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "react-native",
        replacement: path.resolve(__dirname, "src/__mocks__/react-native.ts"),
      },
      {
        find: "expo-router",
        replacement: path.resolve(__dirname, "src/__mocks__/expo-router.ts"),
      },
      {
        find: "@workspace/sdui-sdk",
        replacement: path.resolve(
          __dirname,
          "src/__mocks__/@workspace/sdui-sdk.ts",
        ),
      },
      {
        find: /\.\.\/hooks\/use-mobile-action$/,
        replacement: path.resolve(
          __dirname,
          "src/__mocks__/use-mobile-action.ts",
        ),
      },
    ],
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
    environment: "node",
    exclude: ["node_modules", "dist"],
    testTimeout: 10000,
  },
});
