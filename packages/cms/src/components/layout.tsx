import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { clearToken } from "@/lib/auth";
import {
  LayoutDashboard,
  Monitor,
  Flag,
  Palette,
  FlaskConical,
  BarChart3,
  KeyRound,
  LogOut,
  Layers,
  Megaphone,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavSection = {
  label: string;
  items: { to: string; label: string; icon: LucideIcon }[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Menu",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/screens", label: "Screens", icon: Monitor },
      { to: "/feature-flags", label: "Feature Flags", icon: Flag },
      { to: "/themes", label: "Themes", icon: Palette },
      { to: "/ab-tests", label: "A/B Tests", icon: FlaskConical },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/api-keys", label: "API Keys", icon: KeyRound },
    ],
  },
  {
    label: "Data Sources",
    items: [
      { to: "/marketing", label: "Marketing Data", icon: Megaphone },
      { to: "/accounts", label: "Account Data", icon: Users },
    ],
  },
];

/**
 * Checks whether a nav link is the active route.
 * @param to - The nav link path.
 * @param pathname - The current location pathname.
 * @returns True if the link is active.
 */
function isActive(to: string, pathname: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

/**
 * Main layout with sidebar navigation and header; renders child routes via Outlet.
 */
export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              SDUI Platform
            </h2>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Admin Console
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-3">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.label}
              </p>
              {section.items.map(({ to, label, icon: Icon }) => {
                const active = isActive(to, location.pathname);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                      active
                        ? "bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-900/30 dark:text-primary-300"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        active
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                      }`}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
