import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedRoute: React.FC = () => {
  const token = localStorage.getItem("token");

  if (token) return <Outlet />;

  return <Navigate to={{ pathname: "/login" }} />;
};

export default AuthenticatedRoute;
