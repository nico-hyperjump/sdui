import { Link } from "react-router-dom";
import {
  Monitor,
  Flag,
  Palette,
  FlaskConical,
  BarChart3,
  KeyRound,
  Megaphone,
  Users,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickLink {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

const LINKS: QuickLink[] = [
  {
    to: "/screens",
    label: "Screens",
    description: "Create and manage SDUI screen layouts for each brand",
    icon: Monitor,
    color: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    to: "/feature-flags",
    label: "Feature Flags",
    description: "Toggle features per brand with rollout controls",
    icon: Flag,
    color: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    to: "/themes",
    label: "Themes",
    description: "Customize colors, typography, and assets per brand",
    icon: Palette,
    color: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    to: "/ab-tests",
    label: "A/B Tests",
    description: "Run experiments with variant allocation per screen",
    icon: FlaskConical,
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    to: "/analytics",
    label: "Analytics",
    description: "View event counts, breakdowns, and recent activity",
    icon: BarChart3,
    color: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    to: "/api-keys",
    label: "API Keys",
    description: "Manage access credentials for SDK integrations",
    icon: KeyRound,
    color: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-400",
  },
  {
    to: "/marketing",
    label: "Marketing Data",
    description: "Manage offers, banners, and promotions for each brand",
    icon: Megaphone,
    color: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    to: "/accounts",
    label: "Account Data",
    description: "Manage user accounts, plans, usage, and balances",
    icon: Users,
    color: "bg-cyan-50 dark:bg-cyan-900/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
];

/**
 * Dashboard landing page with quick links to main CMS sections.
 */
export function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Welcome to the SDUI Platform admin console. Manage your multi-brand
          mobile app experience from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map(
          ({ to, label, description, icon: Icon, color, iconColor }) => (
            <Link
              key={to}
              to={to}
              className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {label}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
              </p>
              <ArrowRight className="absolute right-4 top-5 h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
