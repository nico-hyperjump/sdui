const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// pnpm hoists packages into the monorepo root .pnpm store, so Metro must
// be able to resolve modules from both the project and the monorepo root.
config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Singleton packages that must resolve from the mobile app's node_modules.
// Without this, pnpm's strict isolation causes Metro to bundle a separate
// copy of these packages from workspace packages (e.g. sdui-components has
// its own pnpm-installed peer deps). Duplicates cause native view
// re-registration crashes and React context mismatches.
const singletonPkgs = [
  "react",
  "react-native",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "expo-router",
  "react-native-safe-area-context",
  "react-native-screens",
  "expo",
  "expo-constants",
  "expo-status-bar",
  "@expo/vector-icons",
];

const appOrigin = path.join(projectRoot, "index.js");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // For singleton packages, override the origin so Metro resolves from
  // the app's node_modules rather than the importing package's own copy.
  const isSingleton = singletonPkgs.some(
    (pkg) => moduleName === pkg || moduleName.startsWith(pkg + "/"),
  );

  if (isSingleton) {
    return context.resolveRequest(
      { ...context, resolveRequest: undefined, originModulePath: appOrigin },
      moduleName,
      platform,
    );
  }

  return context.resolveRequest(
    { ...context, resolveRequest: undefined },
    moduleName,
    platform,
  );
};

module.exports = config;
