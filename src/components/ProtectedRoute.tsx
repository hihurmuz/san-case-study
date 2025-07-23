import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Permission } from "@/types";

interface ProtectedRouteProps {
  permissions?: Permission[];
  redirectTo?: string;
  children?: React.ReactNode;
}

/**
 * Protected Route component for use with React Router v6
 * Can be used with both children or Outlet pattern
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permissions,
  redirectTo = "/login",
  children,
}) => {
  const { isAuthenticated, hasAllPermissions } = useAuth();
  const location = useLocation();

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
