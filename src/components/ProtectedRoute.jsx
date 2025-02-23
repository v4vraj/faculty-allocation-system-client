import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProtectedRoute = ({ allowedRoles, element }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to unauthorized page if the user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element; // Render the protected element
};

export default ProtectedRoute;
