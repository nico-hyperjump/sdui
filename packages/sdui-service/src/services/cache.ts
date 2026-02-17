type CacheEntry = { data: unknown; expiresAt: number };

/**
 * In-memory cache with TTL support. Entries expire after their TTL and
 * are treated as missing on get.
 */
export class CacheService {
  private readonly store = new Map<string, CacheEntry>();

  /**
   * Retrieves a value by key. Returns undefined if the key is missing or expired.
   *
   * @param key - Cache key.
   * @returns The cached value or undefined.
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data as T;
  }

  /**
   * Stores a value with an optional TTL. Entries without TTL do not expire.
   *
   * @param key - Cache key.
   * @param data - Value to store.
   * @param ttlMs - Optional TTL in milliseconds; if omitted, entry does not expire.
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const expiresAt = ttlMs != null ? Date.now() + ttlMs : Number.POSITIVE_INFINITY;
    this.store.set(key, { data, expiresAt });
  }

  /**
   * Removes a single entry by key.
   *
   * @param key - Cache key to invalidate.
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Removes all entries from the cache.
   */
  clear(): void {
    this.store.clear();
  }
}
