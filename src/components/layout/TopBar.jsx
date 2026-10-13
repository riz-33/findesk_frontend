import React from "react";

export default function Topbar({
  toggleSidebar,
  user = { name: "User", role: "ADMIN" },
}) {
  // Extract first letter for avatar badge
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

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

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-900">{user.name}</p>
          <p className="text-[11px] text-slate-500 uppercase">{user.role}</p>
        </div>
        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full border border-blue-200 flex items-center justify-center font-bold text-xs">
          {initial}
        </div>
      </div>
    </header>
  );
}
