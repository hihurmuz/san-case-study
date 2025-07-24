import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useAccessibility,
  useKeyboardNavigation,
} from "@/hooks/useAccessibility";

const AccessibilityMenu: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    isHighContrast,
    fontSize,
    toggleHighContrast,
    changeFontSize,
    announceToScreenReader,
  } = useAccessibility();

  const { handleKeyDown } = useKeyboardNavigation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleHighContrast = () => {
    toggleHighContrast();
    announceToScreenReader(
      isHighContrast
        ? t("accessibility.highContrastOff", "High contrast mode disabled")
        : t("accessibility.highContrastOn", "High contrast mode enabled")
    );
  };

  const handleFontSizeChange = (
    size: "small" | "normal" | "large" | "extra-large"
  ) => {
    changeFontSize(size);
    announceToScreenReader(
      t("accessibility.fontSizeChanged", `Font size changed to ${size}`)
    );
  };

  const fontSizeOptions = [
    { value: "small", label: t("accessibility.fontSmall", "Small") },
    { value: "normal", label: t("accessibility.fontNormal", "Normal") },
    { value: "large", label: t("accessibility.fontLarge", "Large") },
    {
      value: "extra-large",
      label: t("accessibility.fontExtraLarge", "Extra Large"),
    },
  ] as const;

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) =>
          handleKeyDown(e, {
            onEnter: () => setIsOpen(!isOpen),
            onSpace: () => setIsOpen(!isOpen),
            onEscape: () => setIsOpen(false),
          })
        }
        className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
        aria-label={t("accessibility.openMenu", "Open accessibility menu")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          role="menu"
          aria-labelledby="accessibility-menu"
        >
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
              {t("accessibility.title", "Accessibility")}
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={handleToggleHighContrast}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none"
              role="menuitem"
              aria-pressed={isHighContrast}
            >
              <div className="flex items-center justify-between">
                <span>{t("accessibility.highContrast", "High Contrast")}</span>
                <div
                  className={`w-4 h-4 rounded border-2 ${
                    isHighContrast
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-400"
                  }`}
                >
                  {isHighContrast && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Font Size Options */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t("accessibility.fontSize", "Font Size")}
              </div>
              <div className="space-y-1">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFontSizeChange(option.value)}
                    className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none ${
                      fontSize === option.value
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    role="menuitem"
                    aria-pressed={fontSize === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t("accessibility.keyboardShortcuts", "Keyboard Shortcuts")}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Tab: {t("accessibility.tabHelp", "Navigate forward")}</div>
                <div>
                  Shift+Tab:{" "}
                  {t("accessibility.shiftTabHelp", "Navigate backward")}
                </div>
                <div>
                  Enter/Space:{" "}
                  {t("accessibility.activateHelp", "Activate element")}
                </div>
                <div>
                  Escape: {t("accessibility.escapeHelp", "Close menu/dialog")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AccessibilityMenu.displayName = "AccessibilityMenu";

export default AccessibilityMenu;
