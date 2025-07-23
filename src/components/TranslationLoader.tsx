import React, { ReactNode, useEffect, useState } from "react";
import { useTranslationContext } from "@/providers/TranslationProvider";

interface TranslationLoaderProps {
  resources: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that loads translation resources before rendering children
 */
const TranslationLoader: React.FC<TranslationLoaderProps> = ({
  resources,
  children,
  fallback = (
    <div className="flex justify-center py-4">Loading translations...</div>
  ),
}) => {
  const { loadTranslations, isReady } = useTranslationContext();
  const [loading, setLoading] = useState(!isReady(resources));

  useEffect(() => {
    if (resources.length === 0 || isReady(resources)) {
      setLoading(false);
      return;
    }

    loadTranslations(resources)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load translations:", error);
        // Continue anyway with fallbacks
        setLoading(false);
      });
  }, [resources.join(",")]);

  if (loading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default TranslationLoader;
