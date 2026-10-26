import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./TopBar";
import { Sidebar } from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <Topbar
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        user={user || { name: "User", role: "employee" }}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex">
          <Sidebar isCollapsed={isCollapsed} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
