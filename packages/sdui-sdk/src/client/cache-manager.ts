interface CacheEntry<T> {
  data: T;
  expiresAt: number | null;
}

/**
 * In-memory cache manager for SDK data (e.g. screens, config).
 * Uses a plain Map; a consuming app can layer AsyncStorage or similar for persistence.
 */
export class CacheManager {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  /**
   * Gets a value by key. Returns undefined if missing or expired.
   * @param key - Cache key.
   * @returns The cached value or undefined.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data;
  }

  /**
   * Sets a value with an optional TTL.
   * @param key - Cache key.
   * @param data - Value to store.
   * @param ttlMs - Optional time-to-live in milliseconds; omit for no expiry.
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const expiresAt =
      ttlMs != null ? Date.now() + ttlMs : null;
    this.store.set(key, { data, expiresAt });
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.store.clear();
  }
}
