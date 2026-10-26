import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";
import Title from "../../assets/title.png";

export const Login = () => {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // AuthContext se login function extract karein
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // FIXED: Sending { empId, password } instead of incorrect FormData object
      const response = await api.post("/auth/login", {
        empId,
        password,
      });

      console.log("Login response:", response.data);

      // Call login function from context (stores token & user info)
      login(response.data);

      const { role } = response.data;

      // Role-based navigation
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/emp/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Invalid Employee ID or Password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-full mb-3">
              <img
                src={Logo}
                alt="Findesk Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <img
              src={Title}
              alt="Findesk Title"
              className="mx-auto h-6 w-auto object-contain"
            />
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="e.g. TB0000101"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm font-medium uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
      <footer className="mt-8 text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} FinDesk Finance Operations. All rights
        reserved.
      </footer>
    </div>
  );
};
