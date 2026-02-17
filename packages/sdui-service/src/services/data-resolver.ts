import type { SduiDataSource } from "@workspace/sdui-schema";
import type {
  DataProviderContext,
  DataProviderRegistry,
} from "./data-provider-registry";

/**
 * Resolves all data sources declared on a screen by calling the corresponding
 * registered providers in parallel. Returns a map of source id to resolved data.
 *
 * Providers that fail are logged as warnings but do not block the screen.
 * Their entry in the returned map will be undefined, causing template
 * expressions referencing that source to resolve to empty strings.
 *
 * @param dataSources - Array of data source declarations from the screen.
 * @param context - Request-scoped context (brand, segment, userId).
 * @param registry - The provider registry to look up providers by name.
 * @param logger - Optional logging function for warnings (defaults to console.warn).
 * @returns Map of source id to resolved data.
 */
export async function resolveDataSources(
  dataSources: SduiDataSource[],
  context: DataProviderContext,
  registry: DataProviderRegistry,
  logger: (message: string) => void = console.warn,
): Promise<Record<string, unknown>> {
  const results: Record<string, unknown> = {};

  const tasks = dataSources.map(async (source) => {
    const provider = registry.get(source.provider);
    if (!provider) {
      logger(
        `Data provider "${source.provider}" not found for source "${source.id}"`,
      );
      return;
    }

    try {
      const data = await provider(source.params ?? {}, context);
      results[source.id] = data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger(
        `Data provider "${source.provider}" failed for source "${source.id}": ${message}`,
      );
    }
  });

  await Promise.all(tasks);

  return results;
}
