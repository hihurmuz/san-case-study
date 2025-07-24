import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Permission } from "@/types/index";

// Dummy user data for authentication
const DUMMY_USER: User = {
  name: "John Doe",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: () => void;
  logout: () => void;

  // Selectors
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

/**
 * Auth store using Zustand for global state management
 * Persists user data in localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: () => {
        set({
          user: DUMMY_USER,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      hasPermission: (permission: Permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) ?? false;
      },

      hasAllPermissions: (permissions: Permission[]) => {
        const { user } = get();
        if (!user) return false;
        return permissions.every((permission) =>
          user.permissions.includes(permission)
        );
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
    }
  )
);

export default useAuthStore;
