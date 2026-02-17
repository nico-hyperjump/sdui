import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api-client";
import { setToken } from "@/lib/auth";
import { Layers, ArrowRight } from "lucide-react";

/**
 * Login page with email/password form; redirects to / on success.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await apiClient.login({ email, password });
      setToken(token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary-600 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">SDUI Platform</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Multi-Brand Mobile App
            <br />
            Content Management
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-primary-100">
            Manage screens, themes, feature flags, and A/B tests across all your
            brands from a single unified platform.
          </p>
        </div>
        <p className="text-sm text-primary-200">
          Server-Driven UI Administration Console
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 dark:bg-slate-900">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile-only logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              SDUI Platform
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access the admin console
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="animate-scale-in rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
