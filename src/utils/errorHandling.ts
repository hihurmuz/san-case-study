/**
 * Utility functions for error handling
 */

/**
 * Format API error message for user display
 * @param error Error object from API call
 * @returns Formatted error message
 */
export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle standard Error objects
    return error.message;
  } else if (typeof error === "string") {
    // Handle string errors
    return error;
  } else if (error && typeof error === "object" && "message" in error) {
    // Handle error objects with message property
    return String((error as { message: unknown }).message);
  } else {
    // Fallback for unknown error types
    return "An unexpected error occurred";
  }
};

/**
 * Log error to console with additional context
 * @param error Error object
 * @param context Additional context information
 */
export const logError = (error: unknown, context: string): void => {
  console.error(`Error in ${context}:`, error);

  // In a production app, you might send this to an error tracking service
  // like Sentry, LogRocket, etc.
};

/**
 * Check if error is a network error
 * @param error Error object
 * @returns True if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Check for common network error messages
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("connection") ||
      message.includes("offline") ||
      message.includes("failed to fetch")
    );
  }
  return false;
};

/**
 * Check if error is an authentication error
 * @param error Error object
 * @returns True if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Check for common auth error messages or status codes
    const message = error.message.toLowerCase();
    return (
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("401") ||
      message.includes("403")
    );
  }
  return false;
};
