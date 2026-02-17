/** Minimal useMobileAction mock for unit tests. Returns a no-op dispatch function. */
export function useMobileAction(): (action: unknown) => void {
  return () => {};
}
