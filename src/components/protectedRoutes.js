import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContextApi";

const protectedRoutes = ({ children }) => {
  let user = useUserAuth;
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};
export default protectedRoutes;
