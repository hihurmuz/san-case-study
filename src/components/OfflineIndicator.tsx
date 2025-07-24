import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const OfflineIndicator: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-hide offline message after 5 seconds
  useEffect(() => {
    if (!isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg transition-all duration-300 ${
        isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-200" : "bg-red-200"
          }`}
        />
        <span className="text-sm font-medium">
          {isOnline
            ? t("offline.backOnline", "Back online")
            : t("offline.youAreOffline", "You are offline")}
        </span>
      </div>
    </div>
  );
});

OfflineIndicator.displayName = "OfflineIndicator";

export default OfflineIndicator;
