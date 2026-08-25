import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import BrowsePage from "../pages/buyer/BrowsePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import OrderHistoryPage from "../pages/buyer/OrderHistoryPage";
import CartPage from "../pages/buyer/CartPage";
import AnimalDetailPage from "../pages/buyer/AnimalDetailPage"; // ADD THIS
import CheckoutPage from "../pages/buyer/CheckoutPage"; // 1. ADD THIS
import OrderConfirmationPage from "../pages/buyer/OrderConfirmationPage"; // 2. ADD THIS
import ProtectedRoute from "../features/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/animal/:id" element={<AnimalDetailPage />} /> {/* ADD THIS */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* 3. ADD THESE 2 NEW ROUTES - Only logged in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Route>

      {/* Only farmers */}
      <Route element={<ProtectedRoute roles={['farmer']} />}>
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/orders" element={<OrderHistoryPage />} />
      </Route>
    </Routes>
  );
}