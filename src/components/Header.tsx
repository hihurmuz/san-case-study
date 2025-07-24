import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigation } from "@/utils/navigationGenerator";
import { usePermissions } from "@/hooks/usePermissions";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = React.memo(() => {
  const { isAuthenticated, logout, user } = useAuth();
  const { canCreatePost } = usePermissions();
  const nav = useNavigation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to check if a link is active - memoized for performance
  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  // Handle logout - memoized to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // Redirect is handled by AuthProvider
    }
  }, [logout]);

  // Memoize navigation links to prevent recalculation
  const navigationLinks = useMemo(
    () => [
      {
        to: nav.dashboard.get(),
        label: "Dashboard",
        isActive: isActive("/") && !isActive("/posts"),
      },
      {
        to: nav.posts.get(),
        label: "Posts",
        isActive: isActive("/posts"),
      },
      ...(canCreatePost()
        ? [
            {
              to: nav.createPost.get(),
              label: "Create Post",
              isActive: isActive("/posts/create"),
            },
          ]
        : []),
    ],
    [nav, isActive, canCreatePost]
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center"
            >
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              React SPA
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex ml-8 space-x-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`${
                      link.isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    } transition`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Theme Toggle and User Info */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3 py-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${
                    link.isActive
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300"
                  } py-2`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
