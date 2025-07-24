import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/AuthProvider";
import { TranslationProvider } from "./providers/TranslationProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ServiceWorkerUpdate from "./components/ServiceWorkerUpdate";
import SkipLink from "./components/SkipLink";
import { getPublicRoutes, getProtectedRoutes } from "./config/routes.config";
import "./i18n"; // Initialize i18n
import "./styles/accessibility.css"; // Accessibility styles

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry failed queries once
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
    },
    mutations: {
      retry: 1, // Only retry failed mutations once
    },
  },
});

// Fallback loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TranslationProvider>
              <BrowserRouter>
                <SkipLink />
                <OfflineIndicator />
                <PWAInstallPrompt />
                <ServiceWorkerUpdate />
                <React.Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public routes */}
                    {getPublicRoutes().map((route) => {
                      const Component = route.renderer
                        .component as React.ComponentType;
                      return (
                        <Route
                          key={route.name}
                          path={route.path}
                          element={
                            route.name === "notFound" ? (
                              <Layout>
                                <Component />
                              </Layout>
                            ) : (
                              <Component />
                            )
                          }
                        />
                      );
                    })}

                    {/* Protected routes */}
                    {getProtectedRoutes().map((route) => {
                      const Component = route.renderer
                        .component as React.ComponentType;
                      return (
                        <Route
                          key={route.name}
                          element={
                            <ProtectedRoute
                              permissions={route.permissions}
                              translations={route.translations}
                            />
                          }
                        >
                          <Route
                            path={route.path}
                            element={
                              <Layout>
                                <Component />
                              </Layout>
                            }
                          />
                        </Route>
                      );
                    })}

                    {/* Default redirect to 404 */}
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </React.Suspense>
              </BrowserRouter>
            </TranslationProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
