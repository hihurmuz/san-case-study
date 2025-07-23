import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigation } from "@/utils/navigationGenerator";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const nav = useNavigation();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              React SPA
            </Link>

            {isAuthenticated && (
              <nav className="ml-8 space-x-4">
                <Link
                  to={nav.dashboard.get()}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to={nav.posts.get()}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Posts
                </Link>
              </nav>
            )}
          </div>

          {isAuthenticated && (
            <div>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
