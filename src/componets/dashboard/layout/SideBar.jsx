import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: "/employer-dashboard",
    },
    {
      id: "jobs",
      name: "Jobs",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      submenu: [
        {
          id: "job-posted",
          name: "Job Posted",
          path: "/employer/all-job-list",
        },
        { id: "active-jobs", name: "Active Jobs", path: "/jobs/active" },
        { id: "closed-jobs", name: "Closed Jobs", path: "/jobs/closed" },
        { id: "draft-jobs", name: "Draft Jobs", path: "/jobs/draft" },
      ],
    },
    {
      id: "candidates",
      name: "Candidates",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      submenu: [
        {
          id: "all-candidates",
          name: "All Candidates",
          path: "/candidates/all",
        },
        {
          id: "shortlisted",
          name: "Shortlisted",
          path: "/candidates/shortlisted",
        },
        {
          id: "interviewed",
          name: "Interviewed",
          path: "/candidates/interviewed",
        },
        { id: "hired", name: "Hired", path: "/candidates/hired" },
      ],
    },
    {
      id: "applications",
      name: "Applications",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      path: "/applications",
    },
    {
      id: "messages",
      name: "Messages",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      path: "/messages",
      badge: "5",
    },
    {
      id: "settings",
      name: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      path: "/settings",
    },
  ];

  // Set active menu based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if current path matches any menu item
    for (const item of menuItems) {
      if (item.path === currentPath) {
        setActiveMenu(item.id);
        setOpenSubmenu(null);
        return;
      }
      
      // Check submenu items
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === currentPath) {
            setActiveMenu(subItem.id);
            setOpenSubmenu(item.id);
            return;
          }
        }
      }
    }
  }, [location.pathname]);

  const handleMenuClick = (menuId, path) => {
    const item = menuItems.find((m) => m.id === menuId);

    // If item has submenu, toggle it
    if (item.submenu) {
      if (openSubmenu === menuId) {
        setOpenSubmenu(null);
      } else {
        setOpenSubmenu(menuId);
      }
      setActiveMenu(menuId);
    } else if (path) {
      // If item has a path and no submenu, navigate
      setActiveMenu(menuId);
      navigate(path);
      onClose(); // Close sidebar on mobile after navigation
    }
  };

  const handleSubmenuClick = (submenuId, path) => {
    setActiveMenu(submenuId);
    if (path) {
      navigate(path);
      onClose(); // Close sidebar on mobile after navigation
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 overflow-y-auto`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id || 
                    (item.submenu && item.submenu.some(sub => sub.id === activeMenu))
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === item.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Submenu */}
                {item.submenu && openSubmenu === item.id && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() =>
                            handleSubmenuClick(subItem.id, subItem.path)
                          }
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            activeMenu === subItem.id
                              ? "bg-purple-100 text-purple-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <svg
                            className="w-2 h-2"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          {subItem.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;