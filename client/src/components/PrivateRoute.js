import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const token = sessionStorage.getItem("access_token");
  const isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRole === "admin" && !isAdmin) {
    return <Navigate to="/user" />;
  }

  if (allowedRole === "user" && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
