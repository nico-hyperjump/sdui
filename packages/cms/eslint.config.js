import { config } from "@workspace/eslint-config/base";

/** ESLint configuration for the CMS package. */
export default [
  ...config,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react-strict-structure/no-inline-jsx-functions": "off",
    },
  },
];
