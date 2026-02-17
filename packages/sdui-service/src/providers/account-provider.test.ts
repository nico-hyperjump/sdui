import { describe, it, expect, afterEach, vi } from "vitest";
import { createAccountProvider } from "./account-provider";

describe("createAccountProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches account by userId from the account source API", async () => {
    // Setup
    const mockAccount = { userId: "user-1", name: "Alice", balance: 50000 };
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(mockAccount), { status: 200 }),
      );
    const provider = createAccountProvider("http://test:3003");

    // Act
    const result = await provider({}, { brand: "brand_a", userId: "user-1" });

    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://test:3003/api/accounts/user-1",
    );
    expect(result).toEqual(mockAccount);
  });

  it("returns null when userId is not provided", async () => {
    // Setup
    const provider = createAccountProvider("http://test:3003");

    // Act
    const result = await provider({}, { brand: "brand_a" });

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when account is not found (404)", async () => {
    // Setup
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"error":"Not found"}', { status: 404 }),
    );
    const provider = createAccountProvider("http://test:3003");

    // Act
    const result = await provider({}, { brand: "brand_a", userId: "missing" });

    // Assert
    expect(result).toBeNull();
  });

  it("throws when the API returns a non-OK, non-404 status", async () => {
    // Setup
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Server Error", { status: 500 }),
    );
    const provider = createAccountProvider("http://test:3003");

    // Act & Assert
    await expect(
      provider({}, { brand: "brand_a", userId: "user-1" }),
    ).rejects.toThrow("Account API returned 500");
  });
});
