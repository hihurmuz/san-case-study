import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

const ServiceWorkerUpdate: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: any) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdatePrompt(false);
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    setNeedRefresh(false);
  };

  // Show offline ready notification
  useEffect(() => {
    if (offlineReady) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  return (
    <>
      {/* Update Available Notification */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {t("pwa.updateAvailable", "Update Available")}
              </p>
              <p className="text-xs opacity-90">
                {t("pwa.updateDescription", "A new version is available")}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-white text-blue-600 text-xs font-medium rounded hover:bg-gray-100 transition"
            >
              {t("pwa.update", "Update")}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 bg-blue-700 text-white text-xs font-medium rounded hover:bg-blue-800 transition"
            >
              {t("pwa.later", "Later")}
            </button>
          </div>
        </div>
      )}

      {/* Offline Ready Notification */}
      {offlineReady && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium">
              {t("pwa.offlineReady", "App ready to work offline")}
            </span>
          </div>
        </div>
      )}
    </>
  );
});

ServiceWorkerUpdate.displayName = "ServiceWorkerUpdate";

export default ServiceWorkerUpdate;
