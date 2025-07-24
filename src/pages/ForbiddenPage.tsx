import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * 403 Forbidden page component
 * Displayed when a user attempts to access a route without proper permissions
 */
const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('forbidden.accessForbidden')}</h2>
        <p className="text-gray-600 mb-6">
          {t('forbidden.message')}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {t('forbidden.goToDashboard')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            {t('forbidden.goBack')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
