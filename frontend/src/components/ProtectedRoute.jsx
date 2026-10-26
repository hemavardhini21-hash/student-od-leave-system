import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";

// Guards a route: requires login, and optionally restricts to specific roles.
// Redirects unauthenticated users to /login and unauthorized users to their own dashboard.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
