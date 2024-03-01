import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = ({ element, ...props }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Route {...props} element={element} />;
};

export default PrivateRoute;
