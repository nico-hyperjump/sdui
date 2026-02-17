import {
  createElement,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import type {
  SduiComponent,
  SduiOverlay,
  SduiOverlayStyle,
} from "@workspace/sdui-schema";
import type { ComponentRegistry } from "./component-registry";
import { defaultRegistry } from "./component-registry";
import { OverlayProvider, useOverlay } from "../overlay/overlay-context";

// ---------------------------------------------------------------------------
// Overlay container props — implemented by sdui-components
// ---------------------------------------------------------------------------

/** Props that a platform-specific overlay container must accept. */
export interface OverlayContainerProps {
  /** Visual presentation style. */
  style: SduiOverlayStyle;
  /** Whether the user can dismiss the overlay by tapping outside / swiping. */
  dismissible: boolean;
  /** Whether the overlay is currently visible. */
  visible: boolean;
  /** Called when the overlay should be dismissed. */
  onDismiss: () => void;
  /** Content to render inside the overlay. */
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Main renderer props
// ---------------------------------------------------------------------------

export interface SduiRendererProps {
  /** Top-level components from the screen schema. */
  components: SduiComponent[];
  /** Optional custom registry; uses defaultRegistry if not provided. */
  registry?: ComponentRegistry;
  /** Screen-level overlays to manage (modals, bottom sheets, fullscreen). */
  overlays?: SduiOverlay[];
  /** Platform-specific overlay container component. Required when `overlays` is provided. */
  OverlayContainer?: ComponentType<OverlayContainerProps>;
}

// ---------------------------------------------------------------------------
// Internal node renderers
// ---------------------------------------------------------------------------

interface SduiRendererNodeProps {
  component: SduiComponent;
  registry: ComponentRegistry;
}

/**
 * Renders a single SDUI component and its children recursively.
 * Children are rendered as individual nodes so that container components
 * (e.g. Carousel) can index into them via Children.toArray().
 */
function SduiRendererNode({
  component,
  registry,
}: SduiRendererNodeProps): ReactNode {
  const Component = registry.get(component.type);
  if (!Component) return null;
  const renderedChildren = component.children?.length
    ? component.children.map((child) => (
        <SduiRendererNode
          key={child.id}
          component={child}
          registry={registry}
        />
      ))
    : undefined;
  return createElement(Component, { component }, ...(renderedChildren ?? []));
}

interface SduiRendererItemProps {
  component: SduiComponent;
  registry: ComponentRegistry;
}

function SduiRendererItem({
  component,
  registry,
}: SduiRendererItemProps): ReactNode {
  return <SduiRendererNode component={component} registry={registry} />;
}

interface SduiRendererListProps {
  components: SduiComponent[];
  registry: ComponentRegistry;
}

function SduiRendererList({
  components,
  registry,
}: SduiRendererListProps): ReactNode {
  const items: ReactNode[] = [];
  for (const comp of components) {
    items.push(
      <SduiRendererItem key={comp.id} component={comp} registry={registry} />,
    );
  }
  return <>{items}</>;
}

// ---------------------------------------------------------------------------
// Overlay renderer (lives inside OverlayProvider)
// ---------------------------------------------------------------------------

interface OverlayRendererProps {
  overlays: SduiOverlay[];
  registry: ComponentRegistry;
  OverlayContainer: ComponentType<OverlayContainerProps>;
}

/**
 * Handles on_load triggers, auto-dismiss timers, and renders visible overlays.
 */
function OverlayRenderer({
  overlays,
  registry,
  OverlayContainer,
}: OverlayRendererProps): ReactNode {
  const { showOverlay, dismissOverlay, isVisible } = useOverlay();

  useEffect(() => {
    for (const overlay of overlays) {
      if (overlay.trigger.type === "on_load") {
        showOverlay(overlay.id);
      }
    }
  }, [overlays, showOverlay]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const overlay of overlays) {
      if (overlay.dismissAfterMs && isVisible(overlay.id)) {
        const timer = setTimeout(() => {
          dismissOverlay(overlay.id);
        }, overlay.dismissAfterMs);
        timers.push(timer);
      }
    }
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [overlays, isVisible, dismissOverlay]);

  const elements: ReactNode[] = [];
  for (const overlay of overlays) {
    elements.push(
      <OverlayContainer
        key={overlay.id}
        style={overlay.style}
        dismissible={overlay.dismissible}
        visible={isVisible(overlay.id)}
        onDismiss={() => dismissOverlay(overlay.id)}
      >
        <SduiRendererList components={overlay.components} registry={registry} />
      </OverlayContainer>,
    );
  }
  return <>{elements}</>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Recursively renders an SDUI component tree. Resolves each component type via the registry
 * and renders children recursively. Unknown types render as null.
 *
 * When `overlays` and `OverlayContainer` are provided, wraps the tree in an
 * `OverlayProvider` and renders screen-level overlays after the main content.
 *
 * @param props - components, optional registry, optional overlays and container.
 * @returns Rendered React nodes.
 */
export function SduiRenderer({
  components,
  registry = defaultRegistry,
  overlays,
  OverlayContainer,
}: SduiRendererProps): ReactNode {
  const mainContent = components.length ? (
    <SduiRendererList components={components} registry={registry} />
  ) : null;

  return (
    <OverlayProvider>
      {mainContent}
      {overlays?.length && OverlayContainer ? (
        <OverlayRenderer
          overlays={overlays}
          registry={registry}
          OverlayContainer={OverlayContainer}
        />
      ) : null}
    </OverlayProvider>
  );
}
