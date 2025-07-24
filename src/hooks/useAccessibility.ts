import { useEffect, useCallback, useState } from "react";

export const useAccessibility = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  // Check for user preferences
  useEffect(() => {
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    setIsHighContrast(highContrastQuery.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    highContrastQuery.addEventListener("change", handleHighContrastChange);

    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    setReducedMotion(reducedMotionQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    // Load saved font size preference
    const savedFontSize = localStorage.getItem("accessibility-font-size");
    if (savedFontSize) {
      setFontSize(savedFontSize);
      document.documentElement.setAttribute("data-font-size", savedFontSize);
    }

    // Load saved high contrast preference
    const savedHighContrast = localStorage.getItem(
      "accessibility-high-contrast"
    );
    if (savedHighContrast === "true") {
      setIsHighContrast(true);
      document.documentElement.setAttribute("data-high-contrast", "true");
    }

    return () => {
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange
      );
    };
  }, []);

  // Apply high contrast mode
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
    }
    localStorage.setItem(
      "accessibility-high-contrast",
      isHighContrast.toString()
    );
  }, [isHighContrast]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem("accessibility-font-size", fontSize);
  }, [fontSize]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => !prev);
  }, []);

  const changeFontSize = useCallback(
    (size: "small" | "normal" | "large" | "extra-large") => {
      setFontSize(size);
    },
    []
  );

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    isHighContrast,
    reducedMotion,
    fontSize,
    toggleHighContrast,
    changeFontSize,
    announceToScreenReader,
  };
};

// Hook for managing focus
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback(() => {
    if (focusedElement) {
      focusedElement.focus();
      setFocusedElement(null);
    }
  }, [focusedElement]);

  const saveFocus = useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement);
  }, []);

  const moveFocusToElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  return {
    trapFocus,
    restoreFocus,
    saveFocus,
    moveFocusToElement,
  };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      handlers: {
        onEnter?: () => void;
        onSpace?: () => void;
        onEscape?: () => void;
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
      }
    ) => {
      switch (e.key) {
        case "Enter":
          handlers.onEnter?.();
          break;
        case " ":
          e.preventDefault();
          handlers.onSpace?.();
          break;
        case "Escape":
          handlers.onEscape?.();
          break;
        case "ArrowUp":
          e.preventDefault();
          handlers.onArrowUp?.();
          break;
        case "ArrowDown":
          e.preventDefault();
          handlers.onArrowDown?.();
          break;
        case "ArrowLeft":
          handlers.onArrowLeft?.();
          break;
        case "ArrowRight":
          handlers.onArrowRight?.();
          break;
      }
    },
    []
  );

  return { handleKeyDown };
};
