import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import type { Permission } from "@/types/index";

interface PermissionCheckerProps {
  permissions?: Permission[];
  children: React.ReactNode;
}

/**
 * Higher-order component for route protection based on user permissions
 * Redirects to 403 page if user doesn't have required permissions
 */
export const PermissionChecker: React.FC<PermissionCheckerProps> = ({
  permissions,
  children,
}) => {
  const { isAuthenticated, hasAllPermissions } = useAuth();
  const location = useLocation();

  // If no permissions required, just check authentication
  if (!permissions || permissions.length === 0) {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // Check if user has all required permissions
  if (!isAuthenticated || !hasAllPermissions(permissions)) {
    // Redirect to forbidden page if missing permissions
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  // User has all required permissions, render children
  return <>{children}</>;
};

/**
 * HOC factory to create a component with permission checking
 */
export const withPermissions = (permissions?: Permission[]) => {
  return function WithPermissions(Component: React.ComponentType<any>) {
    return function PermissionCheckedComponent(props: any) {
      return (
        <PermissionChecker permissions={permissions}>
          <Component {...props} />
        </PermissionChecker>
      );
    };
  };
};
