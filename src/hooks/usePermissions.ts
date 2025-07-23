import { useAuth } from "@/providers/AuthProvider";
import type { Permission } from "@/types/index";

// Custom hook for permission checking utilities
export const usePermissions = () => {
  const { user, hasPermission, hasAllPermissions } = useAuth();

  return {
    user,
    hasPermission,
    hasAllPermissions,
    canViewPosts: () => hasPermission("VIEW_POSTS"),
    canViewComments: () => hasPermission("VIEW_COMMENTS"),
    canEditPost: () => hasPermission("EDIT_POST"),
    canCreatePost: () => hasPermission("CREATE_POST"),
    hasAnyPermission: (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.some((permission) =>
        user.permissions.includes(permission)
      );
    },
  };
};
