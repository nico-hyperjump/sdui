import type { PrismaClient } from "@workspace/sdui-database";
import { sduiPrismaClient } from "@workspace/sdui-database";
import type {
  SduiDataSource,
  SduiOverlay,
  SduiScreen,
} from "@workspace/sdui-schema";
import { getActiveTest, assignVariant } from "./ab-test-service";
import type { DataProviderRegistry } from "./data-provider-registry";
import { resolveDataSources } from "./data-resolver";
import { resolveTemplate } from "./template-resolver";

/** Parameters for resolving a screen. */
export type ResolveScreenParams = {
  screenId: string;
  brand: string;
  segment?: string | null;
  userId?: string | null;
  db?: PrismaClient;
  /** Optional data provider registry for resolving data sources. */
  providerRegistry?: DataProviderRegistry;
};

/**
 * Resolves a screen by screenId, brand, and optional segment. Tries the given
 * segment first, then falls back to segment = null. If an active A/B test
 * exists and userId is provided, assigns a variant and uses its components.
 *
 * When the screen declares data sources and a provider registry is supplied,
 * the resolver fetches data from each provider and interpolates template
 * expressions in component props before returning.
 *
 * @param params - screenId, brand, optional segment, optional userId, optional db, optional providerRegistry.
 * @returns The resolved SduiScreen, or null if no screen found.
 */
export async function resolveScreen(
  params: ResolveScreenParams,
): Promise<SduiScreen | null> {
  const {
    screenId,
    brand,
    segment,
    userId,
    db = sduiPrismaClient,
    providerRegistry,
  } = params;

  const segmentValue = segment ?? null;
  let screen = await db.screen.findFirst({
    where: {
      screenId,
      brand,
      segment: segmentValue,
      published: true,
    },
  });

  if (!screen && segment != null && segment !== "") {
    screen = await db.screen.findFirst({
      where: {
        screenId,
        brand,
        segment: null,
        published: true,
      },
    });
  }

  if (!screen) return null;

  let componentsJson = screen.components;
  const test = await getActiveTest(screenId, brand, db);

  if (test && test.variants.length > 0 && userId) {
    const variantName = assignVariant(
      test.id,
      userId,
      test.variants.map((v) => ({ name: v.name, percentage: v.percentage })),
    );
    const variant = test.variants.find((v) => v.name === variantName);
    if (variant) componentsJson = variant.components;
  }

  let components: SduiScreen["components"];
  try {
    components = JSON.parse(componentsJson) as SduiScreen["components"];
  } catch {
    components = [];
  }

  // Parse data sources from the screen record (nullable JSON column).
  let dataSources: SduiDataSource[] | undefined;
  const dataSourcesRaw = (screen as Record<string, unknown>)["dataSources"];
  if (typeof dataSourcesRaw === "string" && dataSourcesRaw.length > 0) {
    try {
      dataSources = JSON.parse(dataSourcesRaw) as SduiDataSource[];
    } catch {
      dataSources = undefined;
    }
  }

  // Parse overlays from the screen record (nullable JSON column).
  let overlays: SduiOverlay[] | undefined;
  const overlaysRaw = (screen as Record<string, unknown>)["overlays"];
  if (typeof overlaysRaw === "string" && overlaysRaw.length > 0) {
    try {
      overlays = JSON.parse(overlaysRaw) as SduiOverlay[];
    } catch {
      overlays = undefined;
    }
  }

  // Resolve data sources and interpolate template expressions.
  if (dataSources && dataSources.length > 0 && providerRegistry) {
    const dataMap = await resolveDataSources(
      dataSources,
      { brand, segment, userId },
      providerRegistry,
    );
    components = resolveTemplate(components, dataMap);
  }

  const result: SduiScreen = {
    schemaVersion: "1.0",
    screenId: screen.screenId,
    brand: screen.brand,
    updatedAt: screen.updatedAt.toISOString(),
    components,
  };

  if (overlays && overlays.length > 0) {
    result.overlays = overlays;
  }

  return result;
}
