import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Automatically close sidebar when navigation occurs (especially for mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Floating Mobile Toggle Button (iPhone Shortcut style) */}
      <div
        className="lg:hidden fixed z-50 shadow-2xl flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all border-4 border-white/30"
        onClick={() => setIsSidebarOpen(true)}
        style={{
          bottom: "30px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          boxShadow: "0 8px 30px rgba(79, 70, 229, 0.4)",
        }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </div>

      {/* Top Bar - z-index: 50 */}
      <TopBar />

      {/* Sidebar - z-index: 40 */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen bg-gray-50">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
