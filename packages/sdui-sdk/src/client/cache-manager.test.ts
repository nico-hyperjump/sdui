import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CacheManager } from "./cache-manager";

describe("CacheManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined for missing key", () => {
    const cache = new CacheManager();
    expect(cache.get("missing")).toBeUndefined();
  });

  it("returns value after set without TTL", () => {
    const cache = new CacheManager();
    cache.set("k", { x: 1 });
    expect(cache.get<{ x: number }>("k")).toEqual({ x: 1 });
  });

  it("returns undefined after TTL expires", () => {
    const cache = new CacheManager();
    cache.set("k", "v", 1000);
    expect(cache.get("k")).toBe("v");
    vi.advanceTimersByTime(1001);
    expect(cache.get("k")).toBeUndefined();
  });

  it("clear removes all entries", () => {
    const cache = new CacheManager();
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBeUndefined();
  });
});
