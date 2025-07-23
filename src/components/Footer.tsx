import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} React SPA with Routing & Auth
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
