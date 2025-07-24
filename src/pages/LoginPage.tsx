import React from "react";
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

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as LocationState)?.from?.pathname || "/";

  // Handle login button click
  const handleLogin = () => {
    login();

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
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
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md border border-blue-100 dark:border-blue-800">
            <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              {t("auth.demoUser")}
            </h2>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{t("auth.name")}:</strong> John Doe
              <br />
              <strong>{t("auth.permissions")}:</strong> VIEW_POSTS,
              VIEW_COMMENTS
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
          >
            {t("auth.signInAsJohnDoe")}
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
