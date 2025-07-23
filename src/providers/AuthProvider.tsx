import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, Permission } from "@/types/index";

// Dummy user data for authentication
const DUMMY_USER: User = {
  name: "John Doe",
  permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
};

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Use React Query to manage user state
  const { data: user = null } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () => {
      // Check if user data exists in localStorage for persistence
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    },
    staleTime: Infinity, // User data doesn't become stale
  });

  const login = () => {
    // Store user data in React Query state and localStorage
    queryClient.setQueryData(["user"], DUMMY_USER);
    localStorage.setItem("user", JSON.stringify(DUMMY_USER));
  };

  const logout = () => {
    // Clear user data from React Query state and localStorage
    queryClient.setQueryData(["user"], null);
    localStorage.removeItem("user");
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) =>
      user.permissions.includes(permission)
    );
  };

  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    hasAllPermissions,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
