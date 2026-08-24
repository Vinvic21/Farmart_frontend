import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuthToken } from './authSlice'; // same folder

const ProtectedRoute = () => {
  const token = useSelector(selectAuthToken);

  // If no token, send them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child route
  return <Outlet />;
};

export default ProtectedRoute;