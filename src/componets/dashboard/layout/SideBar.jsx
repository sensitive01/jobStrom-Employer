import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    path: "/dashboard",
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
        path: "/all-job-list",
      },
      {
        id: "active-jobs",
        name: "Active Jobs",
        path: "/active-jobs",
      },
      {
        id: "closed-jobs",
        name: "Closed Jobs",
        path: "/closed-jobs",
      },
    ],
  },
  {
    id: "interviews",
    name: "Interviews",
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    path: "/interviews",
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
        path: "/all-candidates-list",
      },
      {
        id: "shortlisted",
        name: "Shortlisted",
        path: "/short-listed-candidate",
      },
    ],
  },
  {
    id: "suggested",
    name: "Suggested",
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
    path: "/suggested",
  },
  {
    id: "team",
    name: "Team",
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
    path: "/team",
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
    path: "/chat-page",
  },
  {
    id: "analytics",
    name: "Analytics",
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    path: "/analytics",
  },
  {
    id: "subscription",
    name: "Subscription",
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    path: "/subscription",
  },
  {
    id: "company-profile",
    name: "Company Profile",
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    path: "/company-profile",
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

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load Employer Settings payload cached locally during init
  const employerData = JSON.parse(localStorage.getItem("employerData") || "{}");
  const employerImage =
    employerData?.userProfilePic ||
    localStorage.getItem("userProfilePic") ||
    "";
  const employerName =
    employerData?.companyName || localStorage.getItem("userName") || "Employer";
  const contactPerson = employerData?.contactPerson || "Admin User";

  // Lazily initialize state to prevent FOUC / CSS load flashing delay.
  // This calculates the correct active menu based on the initial pathname
  // instead of defaulting to 'dashboard' universally which causes a visual flash delay.
  const [activeMenu, setActiveMenu] = useState(() => {
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (item.path === currentPath) return item.id;
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === currentPath) return subItem.id;
        }
      }
    }
    return "dashboard";
  });

  const [openSubmenu, setOpenSubmenu] = useState(() => {
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === currentPath) return item.id;
        }
      }
    }
    return null;
  });

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

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        <nav className="p-4">
          <div className="flex flex-col items-center mb-8 mt-2 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl uppercase shadow-md mb-3 border-4 border-purple-50 relative overflow-hidden">
              {employerImage ? (
                <img
                  src={employerImage}
                  alt={employerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                employerName?.charAt(0) || "E"
              )}
            </div>
            <h3 className="font-bold text-gray-800 text-center text-sm px-2">
              {employerName}
            </h3>
            <p className="text-xs text-gray-500 text-center mt-0.5">
              {contactPerson}
            </p>
          </div>

          <div className="mb-4 px-4 text-xs font-semibold text-slate-400 tracking-wider">
            RECRUITER CONSOLE
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id ||
                    (item.submenu &&
                      item.submenu.some((sub) => sub.id === activeMenu))
                      ? "bg-pink-50 text-pink-600 font-medium"
                      : "text-slate-500 hover:bg-slate-50"
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
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
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
