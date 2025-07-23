import { useState, useEffect } from "react";
import { translationService } from "@/services/translationService";

/**
 * Hook for loading and using translations
 * @param resources Array of translation resource identifiers
 * @returns Translation utilities
 */
export const useTranslation = (resources: string[] = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(translationService.isReady(resources));

  useEffect(() => {
    // Skip if no resources or already loaded
    if (resources.length === 0 || translationService.isReady(resources)) {
      setIsReady(true);
      return;
    }

    setIsLoading(true);

    translationService
      .loadTranslations(resources)
      .then(() => {
        setIsReady(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [resources.join(",")]);

  /**
   * Translate a key
   * @param key Translation key
   * @param defaultValue Default value if translation is not found
   * @returns Translated text or default value
   */
  const t = (key: string, defaultValue: string = key): string => {
    return translationService.translate(key, defaultValue);
  };

  return {
    t,
    isLoading,
    isReady,
  };
};

export default useTranslation;
