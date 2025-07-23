import { useState, useCallback } from "react";
import {
  formatApiError,
  isAuthError,
  isNetworkError,
} from "@/utils/errorHandling";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Custom hook for handling errors in components
 * @returns Error handling utilities
 */
export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  const { logout } = useAuth();

  /**
   * Handle error and format it for display
   * @param error Error object
   * @param context Context where the error occurred
   */
  const handleError = useCallback(
    (error: unknown, context: string = "operation") => {
      const formattedError = new Error(formatApiError(error));

      // Log the error
      console.error(`Error in ${context}:`, error);

      // Check for specific error types
      if (isAuthError(error)) {
        // Handle authentication errors
        alert("Your session has expired. Please log in again.");
        logout();
        return;
      }

      if (isNetworkError(error)) {
        // Handle network errors
        formattedError.message =
          "Network error. Please check your connection and try again.";
      }

      // Set the error state
      setError(formattedError);
    },
    [logout]
  );

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
};

export default useErrorHandler;
