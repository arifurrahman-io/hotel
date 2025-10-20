import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

/**
 * A component that guards routes based on authentication status and user role.
 *
 * @param {object} props
 * @param {string} [props.requiredRole] - The role required to access this route (e.g., 'admin').
 */
const ProtectedRoute = ({ requiredRole }) => {
  const user = useAuthStore((state) => state.user);

  // 1. Check if the user is logged in
  if (!user) {
    // If not logged in, redirect to the authentication page with a message.
    // The `replace` prop prevents the user from going back to the protected page.
    return (
      <Navigate to="/auth?message=Please log in to access this page." replace />
    );
  }

  // 2. Check if a specific role is required and if the user has it
  if (requiredRole && user.role !== requiredRole) {
    // If the user does not have the required role, show an error and redirect.
    toast.error("Access Denied: You do not have the required permissions.");
    return <Navigate to="/" replace />;
  }

  // 3. If all checks pass, render the child route component
  return <Outlet />;
};

export default ProtectedRoute;
