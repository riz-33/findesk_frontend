import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./TopBar";
import { Sidebar } from "./sidebar";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock logged-in user state (can later be fetched from AuthContext or Redux)
  const currentUser = {
    name: "Muhammad Rizwan",
    employeeId: "EMP-101",
    role: "employee", // Change to "admin" to test admin view
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <Topbar
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        user={currentUser}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex h-full">
          <Sidebar isCollapsed={isCollapsed} user={currentUser} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
