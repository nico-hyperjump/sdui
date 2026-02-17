import type { SduiComponent } from "@workspace/sdui-schema";

/** Pattern matching template expressions like {{sourceId.path.to.value}}. */
const EXPRESSION_PATTERN = /\{\{([^}]+)\}\}/g;

/** Pattern for a prop value that is exactly one expression with no surrounding text. */
const EXACT_EXPRESSION_PATTERN = /^\{\{([^}]+)\}\}$/;

/**
 * Resolves a dot-path (e.g. "offers.0.title") against a data map.
 * Supports numeric indices for array access.
 *
 * @param dataMap - The resolved data keyed by source id.
 * @param path - Dot-separated path string.
 * @returns The value at the path, or undefined if not found.
 */
export function resolvePath(
  dataMap: Record<string, unknown>,
  path: string,
): unknown {
  const segments = path.split(".");
  let current: unknown = dataMap;

  for (const segment of segments) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

/**
 * Interpolates template expressions in a single prop value.
 * If the entire value is a single expression (e.g. "{{balance.amount}}"),
 * the resolved value's type is preserved (number, boolean, object, etc.).
 * If the value contains mixed text and expressions (e.g. "Hi {{name}}!"),
 * all expressions are replaced as strings.
 *
 * @param value - The prop value (may or may not contain expressions).
 * @param dataMap - The resolved data keyed by source id.
 * @returns The interpolated value.
 */
export function interpolateValue(
  value: unknown,
  dataMap: Record<string, unknown>,
): unknown {
  if (typeof value !== "string") return value;

  const exactMatch = value.match(EXACT_EXPRESSION_PATTERN);
  if (exactMatch) {
    const resolved = resolvePath(dataMap, exactMatch[1]!.trim());
    return resolved ?? "";
  }

  return value.replace(EXPRESSION_PATTERN, (_match, path: string) => {
    const resolved = resolvePath(dataMap, path.trim());
    if (resolved == null) return "";
    return String(resolved);
  });
}

/**
 * Interpolates all template expressions in a props record.
 *
 * @param props - Component props (may be undefined).
 * @param dataMap - The resolved data keyed by source id.
 * @returns New props record with all expressions resolved.
 */
function interpolateProps(
  props: Record<string, unknown> | undefined,
  dataMap: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!props) return props;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    result[key] = interpolateValue(value, dataMap);
  }
  return result;
}

/**
 * Expands a component with a `repeat` directive into multiple components,
 * one per item in the source array. Each clone gets a unique id suffix
 * and the item is made available in the data map under the repeat alias.
 *
 * @param component - The template component with a repeat directive.
 * @param dataMap - The resolved data keyed by source id.
 * @returns Array of expanded components.
 */
function expandRepeat(
  component: SduiComponent,
  dataMap: Record<string, unknown>,
): SduiComponent[] {
  const repeat = component.repeat;
  if (!repeat) return [component];

  const sourceData = resolvePath(dataMap, repeat.source);
  if (!Array.isArray(sourceData)) return [];

  return sourceData.map((item: unknown, index: number) => {
    const itemDataMap = { ...dataMap, [repeat.as]: item };
    const { repeat: _repeat, ...rest } = component;
    return resolveComponentTree(
      { ...rest, id: `${component.id}-${index}` },
      itemDataMap,
    );
  });
}

/**
 * Recursively resolves a single component: interpolates props,
 * expands repeat directives in children, and recurses into children.
 *
 * @param component - The component to resolve.
 * @param dataMap - The resolved data keyed by source id.
 * @returns The resolved component with all expressions interpolated.
 */
function resolveComponentTree(
  component: SduiComponent,
  dataMap: Record<string, unknown>,
): SduiComponent {
  const resolved: SduiComponent = {
    ...component,
    props: interpolateProps(component.props, dataMap),
  };

  if (resolved.children?.length) {
    resolved.children = resolveComponents(resolved.children, dataMap);
  }

  return resolved;
}

/**
 * Resolves an array of components: expands repeat directives and
 * interpolates template expressions throughout the tree.
 *
 * @param components - Array of components to resolve.
 * @param dataMap - The resolved data keyed by source id.
 * @returns New array of fully resolved components.
 */
function resolveComponents(
  components: SduiComponent[],
  dataMap: Record<string, unknown>,
): SduiComponent[] {
  const result: SduiComponent[] = [];

  for (const component of components) {
    if (component.repeat) {
      result.push(...expandRepeat(component, dataMap));
    } else {
      result.push(resolveComponentTree(component, dataMap));
    }
  }

  return result;
}

/**
 * Walks a component tree and resolves all template expressions using the
 * provided data map. Handles repeat directives by expanding template
 * components into multiple instances. This is the main entry point for
 * the template resolution pipeline.
 *
 * @param components - Top-level components from the screen template.
 * @param dataMap - Data keyed by source id (e.g. \{ offers: [...], account: \{...\} \}).
 * @returns Fully resolved component array ready for client consumption.
 */
export function resolveTemplate(
  components: SduiComponent[],
  dataMap: Record<string, unknown>,
): SduiComponent[] {
  return resolveComponents(components, dataMap);
}
