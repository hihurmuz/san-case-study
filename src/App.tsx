import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const PostsPage = React.lazy(() => import("@/pages/PostsPage"));
const PostPage = React.lazy(() => import("@/pages/PostPage"));
const CreatePostPage = React.lazy(() => import("@/pages/CreatePostPage"));
const ForbiddenPage = React.lazy(() => import("@/pages/ForbiddenPage"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage"));

// Fallback loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <TranslationProvider>
            <BrowserRouter>
              <React.Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/404" element={<NotFoundPage />} />

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
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
