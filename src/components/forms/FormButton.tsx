import React from "react";

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = React.memo(
  ({
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    children,
    onClick,
    className = "",
  }) => {
    const baseClasses =
      "font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

FormButton.displayName = "FormButton";

export default FormButton;
