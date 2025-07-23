import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as LocationState)?.from?.pathname || "/";

  // Handle login button click
  const handleLogin = () => {
    login();

    // Redirect to the page user was trying to access or dashboard
    navigate(from, { replace: true });
  };

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">
            Sign in to access the React SPA with routing and authentication
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h2 className="text-lg font-medium text-blue-800 mb-2">
              Demo User
            </h2>
            <p className="text-sm text-blue-700">
              <strong>Name:</strong> John Doe
              <br />
              <strong>Permissions:</strong> VIEW_POSTS, VIEW_COMMENTS
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
          >
            Sign in as John Doe
          </button>

          <p className="text-sm text-gray-500 text-center">
            This is a demo application. Click the button above to sign in with a
            dummy user.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
