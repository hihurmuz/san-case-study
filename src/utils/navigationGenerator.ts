import type { NavigationMethod } from "@/types/index";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { routesConfig, type RouteConfig } from "@/config/routes.config";

// Helper function to replace route parameters with actual values
const interpolateParams = (
  path: string,
  params?: Record<string, any>
): string => {
  if (!params) return path;

  return path.replace(/:(\w+)/g, (_, paramName) => {
    if (params[paramName] === undefined) {
      console.warn(`Missing parameter: ${paramName} for path: ${path}`);
      return `:${paramName}`;
    }
    return String(params[paramName]);
  });
};

// Create a navigation method for a specific route
const createNavigationMethod = (
  routeConfig: RouteConfig,
  navigate: ReturnType<typeof useNavigate>,
  hasPermission: (permission: string) => boolean
): NavigationMethod => {
  return {
    // Get method returns the URL for the route with parameters
    get: (params?: Record<string, any>) => {
      return interpolateParams(routeConfig.path, params);
    },

    // Go method navigates to the route after checking permissions
    go: (params?: Record<string, any>) => {
      // Check if route requires permissions
      if (routeConfig.permissions && routeConfig.permissions.length > 0) {
        const hasAccess = routeConfig.permissions.every((permission) =>
          hasPermission(permission)
        );

        if (!hasAccess) {
          alert(`You don't have permission to access ${routeConfig.name}`);
          return;
        }
      }

      // Navigate to the route with parameters
      navigate(interpolateParams(routeConfig.path, params));
    },
  };
};

// Hook to create the navigation object
export const useNavigation = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Create navigation object with methods for each route
  const navigationObject = routesConfig.reduce((acc, routeConfig) => {
    acc[routeConfig.name] = createNavigationMethod(
      routeConfig,
      navigate,
      // Type assertion to match the expected function signature
      (permission: string) => hasPermission(permission as any)
    );
    return acc;
  }, {} as Record<string, NavigationMethod>);

  return navigationObject;
};
