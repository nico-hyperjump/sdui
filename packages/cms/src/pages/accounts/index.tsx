import { useEffect, useState } from "react";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import { accountClient } from "@/api-client";
import type { UserAccount } from "@/api-client";
import { useBrandFilter } from "@/hooks/use-brand-filter";
import { BrandFilter } from "@/components/brand-filter";
import { Plus, Pencil, Trash2 } from "lucide-react";

const PLAN_TYPES = ["prepaid", "postpaid", "business"];

/**
 * Account data management page with user account listing and edit form.
 */
export function AccountsPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [brandFilter, setBrandFilter] = useBrandFilter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<UserAccount> | null>(null);

  async function loadAccounts() {
    setLoading(true);
    try {
      const list = await accountClient.getAccounts(brandFilter || undefined);
      setAccounts(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, [brandFilter]);

  async function handleSave() {
    if (!editing) return;
    if (editing.userId && editing.id) {
      await accountClient.updateAccount(editing.userId, editing);
    } else {
      await accountClient.createAccount(editing);
    }
    setEditing(null);
    loadAccounts();
  }

  async function handleDelete(userId: string) {
    await accountClient.deleteAccount(userId);
    loadAccounts();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Account Data
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage user accounts, plans, usage, and balances
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              userId: "",
              name: "",
              phoneNumber: "",
              planName: "",
              planType: "prepaid",
              dataLimitGb: 0,
              dataUsedGb: 0,
              balance: 0,
              currency: "IDR",
              brand: "brand_a",
              active: true,
            })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Account
        </button>
      </div>

      {/* Brand filter */}
      <div className="mb-5">
        <BrandFilter value={brandFilter} onChange={setBrandFilter} />
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-5 dark:border-primary-800 dark:bg-primary-900/10">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            {editing.id ? "Edit Account" : "New Account"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                User ID
              </span>
              <input
                placeholder="User ID"
                value={editing.userId ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, userId: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                disabled={!!editing.id}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Name
              </span>
              <input
                placeholder="Name"
                value={editing.name ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Phone Number
              </span>
              <input
                placeholder="Phone Number"
                value={editing.phoneNumber ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, phoneNumber: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Plan Name
              </span>
              <input
                placeholder="Plan Name"
                value={editing.planName ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, planName: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Plan Type
              </span>
              <select
                value={editing.planType ?? "prepaid"}
                onChange={(e) =>
                  setEditing({ ...editing, planType: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                {PLAN_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Brand
              </span>
              <select
                value={editing.brand ?? "brand_a"}
                onChange={(e) =>
                  setEditing({ ...editing, brand: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                {BRAND_IDS.map((b) => (
                  <option key={b} value={b}>
                    {formatBrand(b)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Data Limit (GB)
              </span>
              <input
                placeholder="Data Limit (GB)"
                type="number"
                value={editing.dataLimitGb ?? 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    dataLimitGb: Number(e.target.value),
                  })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Data Used (GB)
              </span>
              <input
                placeholder="Data Used (GB)"
                type="number"
                value={editing.dataUsedGb ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, dataUsedGb: Number(e.target.value) })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Balance
              </span>
              <input
                placeholder="Balance"
                type="number"
                value={editing.balance ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, balance: Number(e.target.value) })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No accounts found.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User ID
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Plan
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Data Usage
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Balance
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Brand
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {a.name}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {a.userId}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-slate-700 dark:text-slate-200">
                      {a.planName}
                    </div>
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {a.planType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    {a.dataUsedGb.toFixed(1)} / {a.dataLimitGb} GB
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    {a.currency} {a.balance.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {formatBrand(a.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(a)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.userId)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
