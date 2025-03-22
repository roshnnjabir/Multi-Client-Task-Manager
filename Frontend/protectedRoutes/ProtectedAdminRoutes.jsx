import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.user?.is_staff);

  return isAuthenticated ? <Outlet /> : <Navigate to="/profile" state={{ message: "You cannot access that page." }} replace />;
};

export default ProtectedAdminRoute;