/// <reference types="vite/client" />
import type {
  LoginRequest,
  LoginResponse,
  ScreenRecord,
  ScreenInput,
  CopyToBrandsResponse,
  FeatureFlag,
  FeatureFlagPatch,
  BrandTheme,
  BrandId,
  AbTest,
  AbTestInput,
  AnalyticsSummary,
  ApiKeyRecord,
  ApiKeyInput,
  ApiKeyCreateResponse,
} from "@workspace/sdui-schema";
import { getToken } from "@/lib/auth";

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: { VITE_CMS_API_URL?: string } }).env
      ?.VITE_CMS_API_URL) ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api/cms`
    : "/api/cms");

/** Options for request(): fetch init minus body, plus optional JSON-serializable body. */
type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Builds request init with JSON body and optional JWT.
 */
async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, ...rest } = options;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

/** Current user returned by getMe. */
export interface MeUser {
  id: string;
  email: string;
}

/** Typed API client for all CMS endpoints. */
export const apiClient = {
  /** Authenticate and return token + user. */
  async login(body: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", { method: "POST", body });
  },

  /** Get current admin user. */
  async getMe(): Promise<MeUser> {
    return request<MeUser>("/auth/me");
  },

  async getScreens(brand?: string): Promise<ScreenRecord[]> {
    const q = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    return request<ScreenRecord[]>(`/screens${q}`);
  },

  async getScreen(id: string): Promise<ScreenRecord> {
    return request<ScreenRecord>(`/screens/${encodeURIComponent(id)}`);
  },

  async createScreen(body: ScreenInput): Promise<ScreenRecord> {
    return request<ScreenRecord>("/screens", { method: "POST", body });
  },

  async updateScreen(
    id: string,
    body: Partial<ScreenInput>,
  ): Promise<ScreenRecord> {
    return request<ScreenRecord>(`/screens/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body,
    });
  },

  async publishScreen(id: string): Promise<ScreenRecord> {
    return request<ScreenRecord>(`/screens/${encodeURIComponent(id)}/publish`, {
      method: "POST",
    });
  },

  async unpublishScreen(id: string): Promise<ScreenRecord> {
    return request<ScreenRecord>(
      `/screens/${encodeURIComponent(id)}/unpublish`,
      {
        method: "POST",
      },
    );
  },

  /** Duplicate a screen within the same brand, creating a draft copy with a suffixed screenId. */
  async duplicateScreen(id: string): Promise<ScreenRecord> {
    return request<ScreenRecord>(
      `/screens/${encodeURIComponent(id)}/duplicate`,
      {
        method: "POST",
      },
    );
  },

  /** Copy a screen to one or more target brands as drafts. */
  async copyScreenToBrands(
    id: string,
    brands: string[],
  ): Promise<CopyToBrandsResponse> {
    return request<CopyToBrandsResponse>(
      `/screens/${encodeURIComponent(id)}/copy-to-brands`,
      {
        method: "POST",
        body: { brands },
      },
    );
  },

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    return request<FeatureFlag[]>("/feature-flags");
  },

  async updateFeatureFlag(
    id: string,
    body: FeatureFlagPatch,
  ): Promise<FeatureFlag> {
    return request<FeatureFlag>(`/feature-flags/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body,
    });
  },

  async getThemes(): Promise<Record<BrandId, BrandTheme>> {
    return request<Record<BrandId, BrandTheme>>("/themes");
  },

  async getTheme(brand: BrandId): Promise<BrandTheme> {
    return request<BrandTheme>(`/themes/${encodeURIComponent(brand)}`);
  },

  async updateTheme(
    brand: BrandId,
    body: Partial<BrandTheme>,
  ): Promise<BrandTheme> {
    return request<BrandTheme>(`/themes/${encodeURIComponent(brand)}`, {
      method: "PATCH",
      body,
    });
  },

  async getAbTests(): Promise<AbTest[]> {
    return request<AbTest[]>("/ab-tests");
  },

  async createAbTest(body: AbTestInput): Promise<AbTest> {
    return request<AbTest>("/ab-tests", { method: "POST", body });
  },

  async activateAbTest(id: string): Promise<AbTest> {
    return request<AbTest>(`/ab-tests/${encodeURIComponent(id)}/activate`, {
      method: "POST",
    });
  },

  async deactivateAbTest(id: string): Promise<AbTest> {
    return request<AbTest>(`/ab-tests/${encodeURIComponent(id)}/deactivate`, {
      method: "POST",
    });
  },

  async selectWinner(id: string, variantId: string): Promise<AbTest> {
    return request<AbTest>(
      `/ab-tests/${encodeURIComponent(id)}/winner?variantId=${encodeURIComponent(variantId)}`,
      { method: "POST" },
    );
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>("/analytics/summary");
  },

  async getAbDistribution(
    testId: string,
  ): Promise<{ variantId: string; count: number }[]> {
    return request<{ variantId: string; count: number }[]>(
      `/analytics/ab-distribution?testId=${encodeURIComponent(testId)}`,
    );
  },

  async getApiKeys(): Promise<ApiKeyRecord[]> {
    return request<ApiKeyRecord[]>("/api-keys");
  },

  async createApiKey(body: ApiKeyInput): Promise<ApiKeyCreateResponse> {
    return request<ApiKeyCreateResponse>("/api-keys", { method: "POST", body });
  },

  async deleteApiKey(id: string): Promise<void> {
    return request<void>(`/api-keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

// ---------------------------------------------------------------------------
// Data source API clients (marketing + account source apps)
// ---------------------------------------------------------------------------

const MARKETING_URL =
  (typeof import.meta !== "undefined" &&
    (
      import.meta as ImportMeta & {
        env?: { VITE_MARKETING_SOURCE_URL?: string };
      }
    ).env?.VITE_MARKETING_SOURCE_URL) ||
  "http://localhost:3002";

const ACCOUNT_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: { VITE_ACCOUNT_SOURCE_URL?: string } })
      .env?.VITE_ACCOUNT_SOURCE_URL) ||
  "http://localhost:3003";

/**
 * Generic fetch helper for source apps (no JWT required).
 */
async function sourceRequest<T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, ...rest } = options;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

/** Shape of an offer from the marketing source. */
export interface MarketingOffer {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  badge: string | null;
  brand: string;
  segment: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Shape of a banner from the marketing source. */
export interface MarketingBanner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  action: string | null;
  brand: string;
  segment: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Shape of a user account from the account source. */
export interface UserAccount {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  planName: string;
  planType: string;
  dataLimitGb: number;
  dataUsedGb: number;
  balance: number;
  currency: string;
  billDate: string | null;
  brand: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** API client for marketing source endpoints. */
export const marketingClient = {
  async getOffers(brand?: string): Promise<MarketingOffer[]> {
    const q = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    return sourceRequest<MarketingOffer[]>(MARKETING_URL, `/api/offers${q}`);
  },

  async getOffer(id: string): Promise<MarketingOffer> {
    return sourceRequest<MarketingOffer>(
      MARKETING_URL,
      `/api/offers/${encodeURIComponent(id)}`,
    );
  },

  async createOffer(body: Partial<MarketingOffer>): Promise<MarketingOffer> {
    return sourceRequest<MarketingOffer>(MARKETING_URL, "/api/offers", {
      method: "POST",
      body,
    });
  },

  async updateOffer(
    id: string,
    body: Partial<MarketingOffer>,
  ): Promise<MarketingOffer> {
    return sourceRequest<MarketingOffer>(
      MARKETING_URL,
      `/api/offers/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body,
      },
    );
  },

  async deleteOffer(id: string): Promise<void> {
    return sourceRequest<void>(
      MARKETING_URL,
      `/api/offers/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  },

  async getBanners(brand?: string): Promise<MarketingBanner[]> {
    const q = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    return sourceRequest<MarketingBanner[]>(MARKETING_URL, `/api/banners${q}`);
  },

  async createBanner(body: Partial<MarketingBanner>): Promise<MarketingBanner> {
    return sourceRequest<MarketingBanner>(MARKETING_URL, "/api/banners", {
      method: "POST",
      body,
    });
  },

  async updateBanner(
    id: string,
    body: Partial<MarketingBanner>,
  ): Promise<MarketingBanner> {
    return sourceRequest<MarketingBanner>(
      MARKETING_URL,
      `/api/banners/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body,
      },
    );
  },

  async deleteBanner(id: string): Promise<void> {
    return sourceRequest<void>(
      MARKETING_URL,
      `/api/banners/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
  },
};

/** API client for account source endpoints. */
export const accountClient = {
  async getAccounts(brand?: string): Promise<UserAccount[]> {
    const q = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    return sourceRequest<UserAccount[]>(ACCOUNT_URL, `/api/accounts${q}`);
  },

  async getAccount(userId: string): Promise<UserAccount> {
    return sourceRequest<UserAccount>(
      ACCOUNT_URL,
      `/api/accounts/${encodeURIComponent(userId)}`,
    );
  },

  async createAccount(body: Partial<UserAccount>): Promise<UserAccount> {
    return sourceRequest<UserAccount>(ACCOUNT_URL, "/api/accounts", {
      method: "POST",
      body,
    });
  },

  async updateAccount(
    userId: string,
    body: Partial<UserAccount>,
  ): Promise<UserAccount> {
    return sourceRequest<UserAccount>(
      ACCOUNT_URL,
      `/api/accounts/${encodeURIComponent(userId)}`,
      { method: "PUT", body },
    );
  },

  async deleteAccount(userId: string): Promise<void> {
    return sourceRequest<void>(
      ACCOUNT_URL,
      `/api/accounts/${encodeURIComponent(userId)}`,
      { method: "DELETE" },
    );
  },
};
