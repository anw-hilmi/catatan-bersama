// src/components/Layout.jsx
import { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import {
  FaGavel,
  FaClipboardList,
  FaCalendarDay,
  FaCalendarAlt,
  FaPrayingHands,
  FaUserShield,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NAV_ITEMS = [
  { title: "Peraturan", icon: FaGavel, href: "/peraturan" },
  { title: "Tugas Utama", icon: FaClipboardList, href: "/tugas-utama" },
  { title: "Tugas Harian", icon: FaCalendarDay, href: "/tugas-harian" },
  { title: "Acara", icon: FaCalendarAlt, href: "/acara" },
  { title: "Doa", icon: FaPrayingHands, href: "/doa" },
  { title: "Admin", icon: FaUserShield, href: "/admin" },
  { title: "Informasi", icon: FaInfoCircle, href: "/informasi" },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const activeItem = NAV_ITEMS.find((item) => item.href === location.pathname);
  const activeTab = activeItem ? activeItem.title : "Peraturan";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800">
      <header className="fixed top-0 z-50 w-full bg-white border-b border-stone-200 shadow-sm">
        <div className="px-3 py-3 lg:px-5 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              type="button"
              className="sm:hidden text-stone-500 hover:text-stone-800 hover:bg-stone-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-200 mr-2 transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-lg font-bold text-stone-800 tracking-wide">
              {activeTab}
            </h1>
          </div>
          <img
            className="w-8 h-8 rounded-full border border-stone-200 shadow-sm"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXmYthElFqHmpxT7RhCBFTlvc_jZennHVMm1BmkfWxWw&s"
            alt="User avatar"
          />
        </div>
      </header>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-sm sm:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-16 transition-transform bg-white border-r border-stone-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] sm:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-amber-50 text-amber-800 font-semibold shadow-sm border border-amber-100/50"
                          : "text-stone-600 hover:bg-stone-50 hover:text-amber-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isActive
                              ? "text-amber-600"
                              : "text-stone-400 group-hover:text-amber-500"
                          }`}
                        />
                        <span className="ms-3">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <main className="p-4 sm:ml-64 pt-20">
        <Outlet />
      </main>
    </div>
  );
}
