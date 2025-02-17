import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, element }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // If still loading authentication status, show loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role doesn't match, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element; // Render the protected element if authenticated and has the correct role
};

export default ProtectedRoute;
