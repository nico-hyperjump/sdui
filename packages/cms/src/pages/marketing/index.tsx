import { useEffect, useState } from "react";
import { BRAND_IDS, formatBrand } from "@workspace/sdui-schema";
import { marketingClient } from "@/api-client";
import type { MarketingOffer, MarketingBanner } from "@/api-client";
import { useBrandFilter } from "@/hooks/use-brand-filter";
import { BrandFilter } from "@/components/brand-filter";
import { Plus, Pencil, Trash2, Tag, Image } from "lucide-react";

/**
 * Marketing data management page with tabbed Offers and Banners views.
 */
export function MarketingPage() {
  const [tab, setTab] = useState<"offers" | "banners">("offers");
  const [offers, setOffers] = useState<MarketingOffer[]>([]);
  const [banners, setBanners] = useState<MarketingBanner[]>([]);
  const [brandFilter, setBrandFilter] = useBrandFilter();
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] =
    useState<Partial<MarketingOffer> | null>(null);
  const [editingBanner, setEditingBanner] =
    useState<Partial<MarketingBanner> | null>(null);

  async function loadOffers() {
    setLoading(true);
    try {
      const list = await marketingClient.getOffers(brandFilter || undefined);
      setOffers(list);
    } finally {
      setLoading(false);
    }
  }

  async function loadBanners() {
    setLoading(true);
    try {
      const list = await marketingClient.getBanners(brandFilter || undefined);
      setBanners(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "offers") loadOffers();
    else loadBanners();
  }, [tab, brandFilter]);

  async function handleSaveOffer() {
    if (!editingOffer) return;
    if (editingOffer.id) {
      await marketingClient.updateOffer(editingOffer.id, editingOffer);
    } else {
      await marketingClient.createOffer(editingOffer);
    }
    setEditingOffer(null);
    loadOffers();
  }

  async function handleDeleteOffer(id: string) {
    await marketingClient.deleteOffer(id);
    loadOffers();
  }

  async function handleSaveBanner() {
    if (!editingBanner) return;
    if (editingBanner.id) {
      await marketingClient.updateBanner(editingBanner.id, editingBanner);
    } else {
      await marketingClient.createBanner(editingBanner);
    }
    setEditingBanner(null);
    loadBanners();
  }

  async function handleDeleteBanner(id: string) {
    await marketingClient.deleteBanner(id);
    loadBanners();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Marketing Data
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage offers, banners, and promotions for each brand
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            tab === "offers"
              ? setEditingOffer({
                  title: "",
                  description: "",
                  price: "",
                  brand: "brand_a",
                  active: true,
                  sortOrder: 0,
                })
              : setEditingBanner({
                  title: "",
                  imageUrl: "",
                  brand: "brand_a",
                  active: true,
                  sortOrder: 0,
                })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          {tab === "offers" ? "Add Offer" : "Add Banner"}
        </button>
      </div>

      {/* Tabs + Filter */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTab("offers")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
              tab === "offers"
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <Tag className="h-4 w-4" /> Offers
          </button>
          <button
            type="button"
            onClick={() => setTab("banners")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
              tab === "banners"
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <Image className="h-4 w-4" /> Banners
          </button>
        </div>
        <BrandFilter value={brandFilter} onChange={setBrandFilter} />
      </div>

      {/* Offer Editor Modal */}
      {editingOffer && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-5 dark:border-primary-800 dark:bg-primary-900/10">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            {editingOffer.id ? "Edit Offer" : "New Offer"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              placeholder="Title"
              value={editingOffer.title ?? ""}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, title: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Description"
              value={editingOffer.description ?? ""}
              onChange={(e) =>
                setEditingOffer({
                  ...editingOffer,
                  description: e.target.value,
                })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Price"
              value={editingOffer.price ?? ""}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, price: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Badge (optional)"
              value={editingOffer.badge ?? ""}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, badge: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <select
              value={editingOffer.brand ?? "brand_a"}
              onChange={(e) =>
                setEditingOffer({ ...editingOffer, brand: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {BRAND_IDS.map((b) => (
                <option key={b} value={b}>
                  {formatBrand(b)}
                </option>
              ))}
            </select>
            <input
              placeholder="Segment (optional)"
              value={editingOffer.segment ?? ""}
              onChange={(e) =>
                setEditingOffer({
                  ...editingOffer,
                  segment: e.target.value || undefined,
                })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSaveOffer}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingOffer(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banner Editor Modal */}
      {editingBanner && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-5 dark:border-primary-800 dark:bg-primary-900/10">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            {editingBanner.id ? "Edit Banner" : "New Banner"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              placeholder="Title"
              value={editingBanner.title ?? ""}
              onChange={(e) =>
                setEditingBanner({ ...editingBanner, title: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Subtitle (optional)"
              value={editingBanner.subtitle ?? ""}
              onChange={(e) =>
                setEditingBanner({ ...editingBanner, subtitle: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              placeholder="Image URL"
              value={editingBanner.imageUrl ?? ""}
              onChange={(e) =>
                setEditingBanner({ ...editingBanner, imageUrl: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <select
              value={editingBanner.brand ?? "brand_a"}
              onChange={(e) =>
                setEditingBanner({ ...editingBanner, brand: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {BRAND_IDS.map((b) => (
                <option key={b} value={b}>
                  {formatBrand(b)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSaveBanner}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingBanner(null)}
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
        ) : tab === "offers" ? (
          offers.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No offers found.
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Brand
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Segment
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Badge
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {offers.map((o) => (
                  <tr
                    key={o.id}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {o.title}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {o.price}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {formatBrand(o.brand)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {o.segment ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {o.badge ? (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {o.badge}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingOffer(o)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOffer(o.id)}
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
          )
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No banners found.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subtitle
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
              {banners.map((b) => (
                <tr
                  key={b.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {b.title}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {b.subtitle ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {formatBrand(b.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingBanner(b)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(b.id)}
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
