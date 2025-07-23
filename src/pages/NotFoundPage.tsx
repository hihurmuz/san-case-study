import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center">
          <div className="text-blue-600 text-9xl font-bold mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
