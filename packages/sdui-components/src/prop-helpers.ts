/**
 * Reads a string value from a component props record.
 * Returns an empty string when the key is missing or the value is not a string.
 * @param props - The component props record (may be undefined).
 * @param key - The property name to look up.
 * @returns The string value, or "" if absent/wrong type.
 */
export function propStr(
  props: Record<string, unknown> | undefined,
  key: string,
): string {
  const v = props?.[key];
  return typeof v === "string" ? v : "";
}

/**
 * Reads a numeric value from a component props record.
 * Returns 0 when the key is missing or the value is not a number.
 * @param props - The component props record (may be undefined).
 * @param key - The property name to look up.
 * @returns The numeric value, or 0 if absent/wrong type.
 */
export function propNum(
  props: Record<string, unknown> | undefined,
  key: string,
): number {
  const v = props?.[key];
  return typeof v === "number" ? v : 0;
}

/**
 * Reads a boolean value from a component props record.
 * Returns false when the key is missing or the value is not a boolean.
 * @param props - The component props record (may be undefined).
 * @param key - The property name to look up.
 * @returns The boolean value, or false if absent/wrong type.
 */
export function propBool(
  props: Record<string, unknown> | undefined,
  key: string,
): boolean {
  const v = props?.[key];
  return typeof v === "boolean" ? v : false;
}

/**
 * Reads an array value from a component props record.
 * Returns an empty array when the key is missing or the value is not an array.
 * @param props - The component props record (may be undefined).
 * @param key - The property name to look up.
 * @returns The array value, or [] if absent/wrong type.
 */
export function propArr(
  props: Record<string, unknown> | undefined,
  key: string,
): unknown[] {
  const v = props?.[key];
  return Array.isArray(v) ? v : [];
}
