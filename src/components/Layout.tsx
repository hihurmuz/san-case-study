import React from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main id="main-content" className="flex-grow py-6" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
