import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { ScreensIndexPage } from "@/pages/screens";
import { ScreenEditorPage } from "@/pages/screens/editor";
import { FeatureFlagsPage } from "@/pages/feature-flags";
import { ThemesPage } from "@/pages/themes";
import { AbTestsPage } from "@/pages/ab-tests";
import { AnalyticsPage } from "@/pages/analytics";
import { ApiKeysPage } from "@/pages/api-keys";
import { MarketingPage } from "@/pages/marketing";
import { AccountsPage } from "@/pages/accounts";
import { getToken } from "@/lib/auth";

/**
 * Wraps protected routes; redirects to /login when not authenticated.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * Root app component with router and all CMS routes.
 */
export function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="screens" element={<ScreensIndexPage />} />
          <Route path="screens/new" element={<ScreenEditorPage />} />
          <Route path="screens/:id/edit" element={<ScreenEditorPage />} />
          <Route path="feature-flags" element={<FeatureFlagsPage />} />
          <Route path="themes" element={<ThemesPage />} />
          <Route path="ab-tests" element={<AbTestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="accounts" element={<AccountsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
