import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  required?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = React.memo(
  ({
    label,
    type = "text",
    placeholder,
    error,
    registration,
    required = false,
    className = "",
  }) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          {...registration}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 transition ${
            error
              ? "border-red-300 dark:border-red-600"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
