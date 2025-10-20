import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AdminLayout from "../components/layout/AdminLayout";

// Route Guard
import ProtectedRoute from "./ProtectedRoute";

// Guest Pages
import HomePage from "../pages/guest/HomePage";
import RoomsPage from "../pages/guest/RoomsPage";
import RoomDetailsPage from "../pages/guest/RoomDetailsPage";
import GuestProfilePage from "../pages/guest/GuestProfilePage"; // Updated import
import BookingPage from "../pages/guest/BookingPage";
import ContactPage from "../pages/guest/ContactPage";
import AboutPage from "../pages/guest/AboutPage";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageRooms from "../pages/admin/ManageRooms";
import Reports from "../pages/admin/Reports";
import AdminProfilePage from "../pages/admin/AdminProfilePage";
import ManageHero from "../pages/admin/ManageHero"; // Renamed import
import GeneralSettings from "../pages/admin/GeneralSettings";
import ManageAboutPage from "../pages/admin/ManageAboutPage";

// Other Pages
import AuthPage from "../pages/AuthPage";
import AuthCallback from "../pages/AuthCallback";
import NotFoundPage from "../pages/NotFoundPage";

/**
 * A wrapper component that applies the main layout (Header and Footer)
 * to all nested child routes.
 */
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Renders the active child route's component */}
      </main>
      <Footer />
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Provides global notifications for the entire app */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* === Public-facing routes with the Main Layout === */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* A nested protected route for logged-in guests */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<GuestProfilePage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
          </Route>
        </Route>

        {/* === Admin routes, protected and using the Admin Layout === */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="hero" element={<ManageHero />} />
            <Route path="settings" element={<GeneralSettings />} />
            <Route path="about" element={<ManageAboutPage />} />
          </Route>
        </Route>

        {/* === Standalone routes without the main layout === */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* === Catch-all route for 404 Not Found pages === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
