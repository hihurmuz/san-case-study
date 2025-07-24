import React from "react";
import type { ReactNode } from "react";

interface ContentCardProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Reusable content card component for dashboard
 */
const ContentCard: React.FC<ContentCardProps> = ({
  title,
  children,
  isLoading = false,
  error = null,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && children}
    </div>
  );
};

export default ContentCard;
