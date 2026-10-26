import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({
  toggleSidebar,
  user = { name: "User", role: "employee" },
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h2 className="text-base font-semibold text-slate-800">
          Finance Operations Portal
        </h2>
      </div>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
          <p className="text-[11px] text-slate-500 uppercase">{user?.role}</p>
        </div>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="cursor-pointer focus:outline-none"
        >
          {user?.image ? (
            <img
              className="w-9 h-9 flex items-center justify-center rounded-full ring-2 ring-white object-cover"
              src={user.image}
              alt="user"
            />
          ) : (
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full border border-blue-200 flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in duration-150">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                {user?.role}
              </p>
            </div>

            <div className="py-1">
              <Link to="/emp/profile" onClick={() => setIsDropdownOpen(false)}>
                <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Your Profile
                </button>
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogoutClick();
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
