// ---------------------------------------------------------------------------
// Provider schema registry — manages the catalog of data provider schemas.
// Types are defined in @workspace/sdui-schema and re-exported here for
// convenient access from within sdui-service consumers.
// ---------------------------------------------------------------------------

import type {
  DataProviderSchema,
  DataProviderFieldSchema,
  DataProviderParamSchema,
} from "@workspace/sdui-schema";

export type {
  DataProviderSchema,
  DataProviderFieldSchema,
  DataProviderParamSchema,
};

/**
 * Registry that maps provider names to their schema descriptions.
 * Used by the CMS API to expose a catalog of available providers
 * and their data shapes for the data-binding picker.
 */
export class DataProviderSchemaRegistry {
  private readonly schemas = new Map<string, DataProviderSchema>();

  /**
   * Registers a provider schema under the given name.
   * Overwrites any existing schema with the same name.
   *
   * @param schema - The full provider schema to register.
   */
  register(schema: DataProviderSchema): void {
    this.schemas.set(schema.name, schema);
  }

  /**
   * Returns the schema for a specific provider, or undefined if not registered.
   *
   * @param name - Provider name to look up.
   * @returns The provider schema or undefined.
   */
  get(name: string): DataProviderSchema | undefined {
    return this.schemas.get(name);
  }

  /**
   * Returns all registered provider schemas.
   *
   * @returns Array of all provider schemas.
   */
  getAll(): DataProviderSchema[] {
    return [...this.schemas.values()];
  }

  /**
   * Returns the names of all registered provider schemas.
   *
   * @returns Array of registered provider names.
   */
  names(): string[] {
    return [...this.schemas.keys()];
  }
}
