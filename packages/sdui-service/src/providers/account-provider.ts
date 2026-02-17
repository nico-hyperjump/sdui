import type { DataProviderFn } from "../services/data-provider-registry";
import type { DataProviderSchema } from "@workspace/sdui-schema";

/**
 * Schema describing the data shape returned by the account provider.
 * Used by the CMS to populate the data-binding picker.
 */
export const accountProviderSchema: DataProviderSchema = {
  name: "account",
  label: "Account Data",
  description:
    "User account information including plan details, data usage, and balance.",
  fields: [
    { name: "name", label: "Account Name", type: "string" },
    { name: "phoneNumber", label: "Phone Number", type: "string" },
    { name: "planName", label: "Plan Name", type: "string" },
    { name: "planType", label: "Plan Type", type: "string" },
    { name: "dataLimitGb", label: "Data Limit (GB)", type: "number" },
    { name: "dataUsedGb", label: "Data Used (GB)", type: "number" },
    { name: "balance", label: "Balance", type: "number" },
    { name: "currency", label: "Currency", type: "string" },
    { name: "billDate", label: "Bill Date", type: "string" },
  ],
};

/**
 * Default URL for the account source API.
 * Override with the ACCOUNT_SOURCE_URL environment variable.
 */
// eslint-disable-next-line strict-env/no-process-env -- provider needs configurable URL
const DEFAULT_URL =
  process.env["ACCOUNT_SOURCE_URL"] ?? "http://localhost:3003";

/**
 * Creates a data provider that fetches user account data (plan info, usage,
 * balance) from the account source API.
 *
 * Requires `userId` in the provider context. If userId is not present,
 * returns null (screen can still render without user data).
 *
 * @param baseUrl - Base URL of the account source (default: ACCOUNT_SOURCE_URL env or http://localhost:3003).
 * @returns A DataProviderFn that fetches account data.
 */
export function createAccountProvider(
  baseUrl: string = DEFAULT_URL,
): DataProviderFn {
  return async (_params, context) => {
    if (!context.userId) {
      return null;
    }

    const url = new URL(
      `/api/accounts/${encodeURIComponent(context.userId)}`,
      baseUrl,
    );

    const response = await fetch(url.toString());
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Account API returned ${response.status}`);
    }

    return (await response.json()) as unknown;
  };
}
