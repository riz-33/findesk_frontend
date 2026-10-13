import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Sidebar = ({
  user = { name: "User", employeeId: "EMP-000", role: "EMPLOYEE" },
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = user.role.toUpperCase();

  // Navigation Links based on Role
  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Employees", href: "/admin/employees" },
    { name: "Payslips Upload", href: "/admin/payslips" },
    { name: "Tax Declarations", href: "/admin/tax-declarations" },
    { name: "Reimbursement Claims", href: "/admin/claims" },
  ];

  const employeeLinks = [
    { name: "Overview", href: "/emp/dashboard" },
    { name: "My Payslips", href: "/emp/payslips" },
    { name: "Tax Certificate", href: "/emp/tax-certificate" },
    { name: "My Claims", href: "/emp/claims" },
    { name: "Profile", href: "/emp/profile" },
  ];

  const navLinks = userRole === "ADMIN" ? adminLinks : employeeLinks;

  const handleSignOut = () => {
    // Clear localStorage or Auth token here
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30 text-lg">
            F
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            FinDesk
          </span>
        </div>

        <div className="px-6 py-4">
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-slate-800 text-blue-400 rounded-md border border-slate-700">
            {userRole === "ADMIN" ? "Finance Admin" : "Employee Self-Service"}
          </span>
        </div>

        {/* Uncommented and fixed active state logic using useLocation */}
        <nav className="px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-500 font-mono">{user.employeeId}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 px-3 py-2 rounded-lg transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};
