import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "@workspace/sdui-schema";
import { apiClient } from "@/api-client";
import { Activity, TrendingUp, Clock } from "lucide-react";

/**
 * Analytics dashboard: total events, counts by type table, recent events log (last 100).
 */
export function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await apiClient.getAnalyticsSummary();
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          Failed to load analytics data.
        </div>
      </div>
    );
  }

  const recent = summary.recentEvents.slice(0, 100);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Event tracking and usage insights across brands
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Events
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {summary.totalEvents.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Event Types
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {summary.countsByType.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Recent Events
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {recent.length}
          </p>
        </div>
      </div>

      {/* Events by type */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Events by Type
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Event Type
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Count
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summary.countsByType.map((row) => {
                const pct =
                  summary.totalEvents > 0
                    ? (row.count / summary.totalEvents) * 100
                    : 0;
                return (
                  <tr
                    key={row.eventType}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-3.5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {row.eventType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {row.count.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {summary.countsByType.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-sm text-slate-400"
                  >
                    No events recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent events */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Recent Events
          <span className="ml-2 text-xs font-normal text-slate-400">
            (last 100)
          </span>
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Type
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Brand
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Screen
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((ev) => (
                <tr
                  key={ev.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {ev.eventType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    {ev.brand}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {ev.screenId ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400 dark:text-slate-500">
                    {ev.createdAt}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-sm text-slate-400"
                  >
                    No recent events
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
