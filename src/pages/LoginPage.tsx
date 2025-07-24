import React from "react";
import santsgLogo from "@/assets/santsg-logo-1.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/AuthProvider";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUser, setSelectedUser] = React.useState<"viewer" | "admin">(
    "viewer"
  );

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as LocationState)?.from?.pathname || "/";

  // Handle login button click
  const handleLogin = () => {
    login(selectedUser);

    // Redirect to the page user was trying to access or dashboard
    navigate(from, { replace: true });
  };

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <img src={santsgLogo} alt="Giriş Sayfası Görseli" className="w-64 mb-8" />
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t("auth.welcome")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("auth.signInDescription")}
          </p>
        </div>

        <div className="space-y-6">
          {/* User Selection */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md border border-blue-100 dark:border-blue-800">
            <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
              {t("auth.selectUser", "Select User")}
            </h2>

            <div className="space-y-3">
              {/* Viewer User */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="viewer"
                  checked={selectedUser === "viewer"}
                  onChange={(e) =>
                    setSelectedUser(e.target.value as "viewer" | "admin")
                  }
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    John Doe ({t("auth.viewer", "Viewer")})
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {t("auth.permissions")}: VIEW_POSTS, VIEW_COMMENTS
                  </div>
                </div>
              </label>

              {/* Admin User */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={selectedUser === "admin"}
                  onChange={(e) =>
                    setSelectedUser(e.target.value as "viewer" | "admin")
                  }
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Jane Smith ({t("auth.admin", "Admin")})
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {t("auth.permissions")}: {t("auth.allPermissions")}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
          >
            {t("auth.signInAs", "Sign in as")}{" "}
            {selectedUser === "viewer" ? "John Doe" : "Jane Smith"}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t("auth.demoDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
