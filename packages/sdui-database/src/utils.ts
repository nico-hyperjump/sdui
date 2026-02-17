import { createHash } from "node:crypto";

/**
 * Hashes an API key using SHA-256 for storage comparison.
 * The raw key is never stored; only the hash is persisted.
 *
 * @param rawKey - The plaintext API key to hash.
 * @returns The hex-encoded SHA-256 hash of the key.
 */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}
