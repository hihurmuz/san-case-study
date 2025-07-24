import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslationContext } from "@/providers/TranslationProvider";
import type { Permission } from "@/types/index";

interface ProtectedRouteProps {
  permissions?: Permission[];
  redirectTo?: string;
  children?: React.ReactNode;
  translations?: string[];
}

/**
 * Protected Route component for use with React Router v6
 * Can be used with both children or Outlet pattern
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permissions,
  redirectTo = "/login",
  children,
  translations = [],
}) => {
  const { isAuthenticated, hasAllPermissions } = useAuth();
  const { loadTranslations, isReady } = useTranslationContext();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(
    translations.length > 0 && !isReady(translations)
  );

  // Load translations if needed
  useEffect(() => {
    if (translations.length === 0 || isReady(translations)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    loadTranslations(translations)
      .then(() => {
        // Translations loaded successfully
      })
      .catch((error) => {
        console.error("Failed to load translations:", error);
        // Continue anyway with fallbacks
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [translations.join(",")]);

  // Show loading indicator while translations are loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading translations...</span>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  if (permissions && permissions.length > 0) {
    if (!hasAllPermissions(permissions)) {
      return <Navigate to="/403" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has required permissions
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
