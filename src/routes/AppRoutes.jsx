import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import BrowsePage from "../pages/buyer/BrowsePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import OrderHistoryPage from "../pages/buyer/OrderHistoryPage";
import CartPage from "../pages/buyer/CartPage";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} /> {/* <-- KEY CHANGE: Made it PUBLIC */}

      {/* Only logged in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Route>

      {/* Only farmers */}
      <Route element={<ProtectedRoute roles={['farmer']} />}>
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/orders" element={<OrderHistoryPage />} />
      </Route>
    </Routes>
  );
}