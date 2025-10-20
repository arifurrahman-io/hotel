import React, { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BedDouble,
  BookCopy,
  BarChart2,
  Menu,
  X,
  Home,
  UserCog,
  LayoutTemplate,
  SlidersHorizontal,
  BookText,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSettingsStore } from "../../store/useSettingsStore";

// Data-driven navigation for easy updates and organization
const navLinks = [
  { type: "header", title: "Analytics" },
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Reports", href: "/admin/reports", icon: BarChart2 },
  { type: "header", title: "Management" },
  { title: "Bookings", href: "/admin/bookings", icon: BookCopy },
  { title: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { type: "header", title: "Content" },
  { title: "Hero Section", href: "/admin/hero", icon: LayoutTemplate },
  { title: "About Page", href: "/admin/about", icon: BookText }, // **FIX: Missing link added**
  { type: "header", title: "Configuration" },
  {
    title: "General Settings",
    href: "/admin/settings",
    icon: SlidersHorizontal,
  },
  { title: "Profile", href: "/admin/profile", icon: UserCog },
];

// Memoized Sidebar Content to prevent re-renders
const SidebarContent = React.memo(({ onLinkClick }) => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);

  const linkClass =
    "flex items-center px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors";
  const activeLinkClass = "bg-gray-700 text-white";

  const handleLogout = () => {
    logout();
    navigate("/");
    onLinkClick();
  };

  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white truncate">
          {settings?.hotelName || "Admin Panel"}
        </h2>
        <p className="text-sm text-gray-400 truncate">
          Welcome, {user?.name.split(" ")[0]}
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((item, index) =>
          item.type === "header" ? (
            <p
              key={index}
              className="px-4 pt-4 pb-2 text-xs font-semibold uppercase text-gray-400 tracking-wider"
            >
              {item.title}
            </p>
          ) : (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeLinkClass : ""}`
              }
              onClick={onLinkClick}
              end
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" /> {item.title}
            </NavLink>
          )
        )}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link to="/" className={linkClass} onClick={onLinkClick}>
          <Home className="w-5 h-5 mr-3" /> View Site
        </Link>
        <button onClick={handleLogout} className={`${linkClass} w-full`}>
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </>
  );
});

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const settings = useSettingsStore((state) => state.settings);
  const location = useLocation();

  // Dynamic Page Title Effect
  useEffect(() => {
    const currentLink = navLinks.find(
      (link) => link.href === location.pathname
    );
    if (currentLink) {
      document.title = `${currentLink.title} | ${
        settings?.hotelName || "Admin"
      }`;
    }
  }, [location, settings]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-800 text-white flex-shrink-0">
        <SidebarContent onLinkClick={() => {}} />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 flex flex-col w-64 h-full bg-gray-800 text-white z-50 lg:hidden"
            >
              <SidebarContent onLinkClick={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col w-0">
        {" "}
        {/* w-0 prevents overflow on flex child */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-30">
          <Link to="/" className="text-xl font-bold text-gray-800 truncate">
            {settings?.hotelName || "Admin"}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
