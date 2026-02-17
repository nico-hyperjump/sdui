import type { DataProviderFn } from "../services/data-provider-registry";

/**
 * Default URL for the marketing source API.
 * Override with the MARKETING_SOURCE_URL environment variable.
 */
// eslint-disable-next-line strict-env/no-process-env -- provider needs configurable URL
const DEFAULT_URL =
  process.env["MARKETING_SOURCE_URL"] ?? "http://localhost:3002";

/**
 * Creates a data provider that fetches marketing data (offers, banners)
 * from the marketing source API.
 *
 * @param baseUrl - Base URL of the marketing source (default: MARKETING_SOURCE_URL env or http://localhost:3002).
 * @returns A DataProviderFn that fetches offers from the marketing source.
 */
export function createMarketingProvider(
  baseUrl: string = DEFAULT_URL,
): DataProviderFn {
  return async (params, context) => {
    const url = new URL("/api/offers", baseUrl);
    url.searchParams.set("brand", context.brand);
    if (context.segment) {
      url.searchParams.set("segment", context.segment);
    }
    const limit =
      typeof params["limit"] === "number" ? params["limit"] : undefined;

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Marketing API returned ${response.status}`);
    }

    let offers: unknown[] = (await response.json()) as unknown[];

    if (limit != null && limit > 0) {
      offers = offers.slice(0, limit);
    }

    return offers;
  };
}
