/**
 * Context information passed to every data provider at resolve time.
 * Contains request-scoped details like brand, user segment, and user identity.
 */
export interface DataProviderContext {
  /** The brand identifier for this request (e.g. "brand_a"). */
  brand: string;
  /** Optional user segment (e.g. "prepaid", "postpaid"). */
  segment?: string | null;
  /** Optional user identifier for user-specific data. */
  userId?: string | null;
}

/**
 * A data provider function that fetches data from an external source.
 * Providers are registered by name and invoked by the data resolver when
 * a screen declares a data source referencing that provider.
 *
 * @param params - Provider-specific parameters from the data source declaration.
 * @param context - Request-scoped context (brand, segment, userId).
 * @returns Resolved data (any shape — objects, arrays, primitives).
 */
export type DataProviderFn = (
  params: Record<string, unknown>,
  context: DataProviderContext,
) => Promise<unknown>;

/**
 * Registry that maps provider names to their implementation functions.
 * Used by the data resolver to look up which function to call for each
 * data source declared on a screen.
 */
export class DataProviderRegistry {
  private readonly providers = new Map<string, DataProviderFn>();

  /**
   * Registers a data provider under the given name.
   * Overwrites any existing provider with the same name.
   *
   * @param name - Unique provider name (e.g. "marketing", "account").
   * @param provider - The async function that fetches the data.
   */
  register(name: string, provider: DataProviderFn): void {
    this.providers.set(name, provider);
  }

  /**
   * Returns the provider function registered under the given name,
   * or undefined if no provider is registered with that name.
   *
   * @param name - Provider name to look up.
   * @returns The provider function or undefined.
   */
  get(name: string): DataProviderFn | undefined {
    return this.providers.get(name);
  }

  /**
   * Returns the names of all registered providers.
   *
   * @returns Array of registered provider names.
   */
  names(): string[] {
    return [...this.providers.keys()];
  }
}
