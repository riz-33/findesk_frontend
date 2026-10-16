import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
// import { AuthContext } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // setErrorMessage("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      login(email, password); // Call the login function from AuthContext
      const { token, role } = response.data;

      // Mock Role-Based Routing Logic after successful login:
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/emp/dashboard");

      console.log("Logging in with:", { email, password });
    } catch (error) {
      setErrorMessage("Invalid Email or Password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl mb-3 shadow-md shadow-blue-600/20">
              F
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              FinDesk
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Employee Self-Service & Payroll Portal
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold  tracking-wider text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email} // Bound state variable
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.doe@company.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all  text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold  tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password} // Bound state variable
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading} // Reactivated loading state disable rule
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
