import React from "react";
import { useTranslation } from "react-i18next";

const SkipLink: React.FC = React.memo(() => {
  const { t } = useTranslation();

  const handleSkipToMain = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <a href="#main-content" onClick={handleSkipToMain} className="skip-link">
      {t("accessibility.skipToMain", "Skip to main content")}
    </a>
  );
});

SkipLink.displayName = "SkipLink";

export default SkipLink;
