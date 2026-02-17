import { ComponentRegistry } from "@workspace/sdui-sdk";
import { mobileComponentMap } from "./component-map";

/**
 * Pre-built ComponentRegistry for React Native / Expo mobile apps.
 * Created from the type-safe `mobileComponentMap`, guaranteeing every
 * SDUI component type has a registered implementation.
 *
 * Pass this to `SduiRenderer` or `SduiProvider` as the `registry` prop.
 */
export const mobileRegistry: ComponentRegistry =
  ComponentRegistry.fromMap(mobileComponentMap);
