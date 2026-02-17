/** Minimal expo-router mock for unit tests. */
export function useRouter() {
  return { push: () => {}, replace: () => {}, back: () => {} };
}
