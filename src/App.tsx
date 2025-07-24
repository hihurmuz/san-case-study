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

// Lazy load pages with chunk names for better debugging
const LoginPage = React.lazy(
  () => import(/* webpackChunkName: "login" */ "./pages/LoginPage")
);
const DashboardPage = React.lazy(
  () => import(/* webpackChunkName: "dashboard" */ "./pages/DashboardPage")
);
const PostsPage = React.lazy(
  () => import(/* webpackChunkName: "posts" */ "./pages/PostsPage")
);
const PostPage = React.lazy(
  () => import(/* webpackChunkName: "post-detail" */ "./pages/PostPage")
);
const CreatePostPage = React.lazy(
  () => import(/* webpackChunkName: "create-post" */ "./pages/CreatePostPage")
);
const ForbiddenPage = React.lazy(
  () => import(/* webpackChunkName: "error-pages" */ "./pages/ForbiddenPage")
);
const NotFoundPage = React.lazy(
  () => import(/* webpackChunkName: "error-pages" */ "./pages/NotFoundPage")
);

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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/403" element={<ForbiddenPage />} />
                    <Route
                      path="/404"
                      element={
                        <Layout>
                          <NotFoundPage />
                        </Layout>
                      }
                    />

                    {/* Protected routes */}
                    <Route
                      element={
                        <ProtectedRoute
                          permissions={["VIEW_POSTS", "VIEW_COMMENTS"]}
                        />
                      }
                    >
                      <Route
                        path="/"
                        element={
                          <Layout>
                            <DashboardPage />
                          </Layout>
                        }
                      />
                    </Route>

                    <Route
                      element={<ProtectedRoute permissions={["VIEW_POSTS"]} />}
                    >
                      <Route
                        path="/posts"
                        element={
                          <Layout>
                            <PostsPage />
                          </Layout>
                        }
                      />
                    </Route>

                    <Route
                      element={<ProtectedRoute permissions={["VIEW_POSTS"]} />}
                    >
                      <Route
                        path="/posts/:id"
                        element={
                          <Layout>
                            <PostPage />
                          </Layout>
                        }
                      />
                      <Route
                        path="/posts/:id/edit"
                        element={
                          <Layout>
                            <PostPage />
                          </Layout>
                        }
                      />
                      <Route
                        path="/posts/:id/comments"
                        element={
                          <Layout>
                            <PostPage />
                          </Layout>
                        }
                      />
                    </Route>

                    <Route
                      element={<ProtectedRoute permissions={["CREATE_POST"]} />}
                    >
                      <Route
                        path="/posts/create"
                        element={
                          <Layout>
                            <CreatePostPage />
                          </Layout>
                        }
                      />
                    </Route>

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
