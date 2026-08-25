import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // send to login if not logged in
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />; // send home if wrong role
  }

  return <Outlet />; // render the child route
}