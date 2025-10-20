import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Hotel, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "../../store/useSettingsStore";

const Header = () => {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const settings = useSettingsStore((state) => state.settings);

  // Function to close the mobile menu, useful when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
      : "text-gray-700 hover:text-indigo-600 transition-colors";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive ? "text-indigo-500 bg-indigo-50" : "text-gray-800";

  // Renders the main navigation links
  const NavLinks = ({ mobile = false }) => (
    <>
      <NavLink
        to="/"
        className={mobile ? mobileNavLinkClass : navLinkClass}
        onClick={closeMenu}
      >
        Home
      </NavLink>
      <NavLink
        to="/rooms"
        className={mobile ? mobileNavLinkClass : navLinkClass}
        onClick={closeMenu}
      >
        Rooms
      </NavLink>
      <NavLink
        to="/about"
        className={mobile ? mobileNavLinkClass : navLinkClass}
        onClick={closeMenu}
      >
        About
      </NavLink>
      <NavLink
        to="/contact"
        className={mobile ? mobileNavLinkClass : navLinkClass}
        onClick={closeMenu}
      >
        Contact
      </NavLink>

      {user?.role === "admin" && (
        <NavLink
          to="/admin/dashboard"
          className={mobile ? mobileNavLinkClass : navLinkClass}
          onClick={closeMenu}
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  // Renders the user-specific action buttons (Login/Logout/Profile)
  const UserActions = () => {
    if (user) {
      const profileLink = user.role === "admin" ? "/admin/profile" : "/profile";
      return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <Link
            to={profileLink}
            onClick={closeMenu}
            className="font-medium text-gray-700 hover:text-indigo-600 transition-colors text-center"
          >
            Hi, {user.name.split(" ")[0]}
          </Link>
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <Link
          to="/auth"
          onClick={closeMenu}
          className="px-4 py-2 text-sm font-medium text-center text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/auth?mode=register"
          onClick={closeMenu}
          className="px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Hotel className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              {settings?.hotelName || "StayEase"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <NavLinks />
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center">
            <UserActions />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg z-40"
          >
            <div className="flex flex-col gap-1 px-4 pt-4 pb-6">
              <NavLinks mobile={true} />
            </div>
            <div className="px-4 pb-6 border-t border-gray-200">
              <UserActions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
