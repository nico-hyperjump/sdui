import type {
  GetScreenQuery,
  GetScreenResponse,
  GetConfigResponse,
  GetOffersResponse,
  AnalyticsEventInput,
} from "@workspace/sdui-schema";

/** Query params for the offers endpoint (brand and optional user_segment). */
export interface GetOffersQuery {
  brand: string;
  user_segment?: string;
}

/**
 * Configuration for the SDUI HTTP client.
 */
export interface SduiClientConfig {
  /** Base URL of the SDUI service (e.g. https://sdui.example.com). */
  serviceUrl: string;
  /** API key for authenticating requests (sent as X-API-Key header). */
  apiKey: string;
}

/**
 * HTTP client for the SDUI service. All requests include the X-API-Key header.
 * Uses the global fetch API (available in React Native and Node 18+).
 */
export class SduiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  /**
   * Creates an SDUI client.
   * @param config - Service URL and API key.
   */
  constructor(config: SduiClientConfig) {
    this.baseUrl = config.serviceUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
  }

  /**
   * Builds request headers including the API key.
   * @returns Headers object with X-API-Key set.
   */
  private headers(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
    };
  }

  /**
   * Fetches a screen definition by ID.
   * @param screenId - The screen identifier.
   * @param params - Optional query params (brand, user_segment, etc.).
   * @returns The screen payload or throws on HTTP error.
   */
  async fetchScreen(
    screenId: string,
    params?: Partial<GetScreenQuery>,
  ): Promise<GetScreenResponse> {
    const search = new URLSearchParams();
    if (params?.brand) search.set("brand", params.brand);
    if (params?.user_segment) search.set("user_segment", params.user_segment);
    if (params?.ab_test_group) search.set("ab_test_group", params.ab_test_group);
    if (params?.user_id) search.set("user_id", params.user_id);
    const qs = search.toString();
    const url = `${this.baseUrl}/screens/${encodeURIComponent(screenId)}${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) {
      throw new Error(`SduiClient.fetchScreen failed: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<GetScreenResponse>;
  }

  /**
   * Fetches brand configuration (theme and feature flags).
   * @param brand - Brand identifier.
   * @returns The brand config or throws on HTTP error.
   */
  async fetchConfig(brand: string): Promise<GetConfigResponse> {
    const url = `${this.baseUrl}/config/${encodeURIComponent(brand)}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) {
      throw new Error(`SduiClient.fetchConfig failed: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<GetConfigResponse>;
  }

  /**
   * Fetches personalized offers for a brand/segment.
   * @param params - Brand and optional user_segment.
   * @returns The offers response or throws on HTTP error.
   */
  async fetchOffers(params: GetOffersQuery): Promise<GetOffersResponse> {
    const search = new URLSearchParams({ brand: params.brand });
    if (params.user_segment) search.set("user_segment", params.user_segment);
    const url = `${this.baseUrl}/content/offers?${search.toString()}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) {
      throw new Error(`SduiClient.fetchOffers failed: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<GetOffersResponse>;
  }

  /**
   * Sends an analytics event to the service.
   * @param event - The event payload (eventType, brand, etc.).
   * @returns Resolves when the request completes; throws on HTTP error.
   */
  async trackEvent(event: AnalyticsEventInput): Promise<void> {
    const url = `${this.baseUrl}/analytics/events`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      throw new Error(`SduiClient.trackEvent failed: ${res.status} ${res.statusText}`);
    }
  }
}
