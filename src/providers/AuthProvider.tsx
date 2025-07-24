import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import type { User, Permission } from "@/types/index";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasAllPermissions,
  } = useAuthStore();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // The Zustand persist middleware handles this automatically
    // This effect is just for any additional initialization if needed
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasAllPermissions,
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
