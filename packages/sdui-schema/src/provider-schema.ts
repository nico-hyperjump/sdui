// ---------------------------------------------------------------------------
// Provider schema types — shared between backend (sdui-service) and
// frontend (CMS) so both can understand the shape of data providers.
// ---------------------------------------------------------------------------

/**
 * Describes a single field in a data provider's return value.
 * For object or array types, `children` lists the nested fields.
 */
export interface DataProviderFieldSchema {
  /** Machine name used in template expressions (e.g. "planName"). */
  name: string;
  /** Human-readable label shown in the CMS picker (e.g. "Plan Name"). */
  label: string;
  /** Data type of this field. */
  type: "string" | "number" | "boolean" | "object" | "array";
  /** Nested field definitions for object or array item types. */
  children?: DataProviderFieldSchema[];
}

/**
 * Describes a parameter a data provider accepts in its data source declaration.
 */
export interface DataProviderParamSchema {
  /** Parameter name (e.g. "limit"). */
  name: string;
  /** Human-readable label for the CMS UI. */
  label: string;
  /** Value type of the parameter. */
  type: "string" | "number" | "boolean";
  /** Whether this parameter is required. */
  required?: boolean;
  /** Default value shown in the CMS when adding the data source. */
  defaultValue?: unknown;
}

/**
 * Full schema describing a data provider — its identity, the shape of the
 * data it returns, and the parameters it accepts.
 */
export interface DataProviderSchema {
  /** Unique provider name (e.g. "account"). */
  name: string;
  /** Human-readable display name for the CMS (e.g. "Account Data"). */
  label: string;
  /** Short description of what this provider supplies. */
  description: string;
  /** Shape of the data returned by the provider. */
  fields: DataProviderFieldSchema[];
  /** Parameters accepted in the data source declaration. */
  params?: DataProviderParamSchema[];
}
