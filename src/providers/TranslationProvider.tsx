import React, { createContext, useContext, ReactNode } from "react";
import { translationService } from "@/services/translationService";

interface TranslationContextType {
  loadTranslations: (resources: string[]) => Promise<void>;
  isReady: (resources: string[]) => boolean;
  t: (key: string, defaultValue?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const loadTranslations = (resources: string[]): Promise<void> => {
    return translationService.loadTranslations(resources);
  };

  const isReady = (resources: string[]): boolean => {
    return translationService.isReady(resources);
  };

  const t = (key: string, defaultValue: string = key): string => {
    return translationService.translate(key, defaultValue);
  };

  const value: TranslationContextType = {
    loadTranslations,
    isReady,
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = (): TranslationContextType => {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider"
    );
  }

  return context;
};
