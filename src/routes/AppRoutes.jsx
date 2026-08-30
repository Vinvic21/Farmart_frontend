import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import BrowsePage from "../pages/buyer/BrowsePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import OrderHistoryPage from "../pages/buyer/OrderHistoryPage";
import CartPage from "../pages/buyer/CartPage";
import AnimalDetailPage from "../pages/buyer/AnimalDetailPage";
import CheckoutPage from "../pages/buyer/CheckoutPage";
import OrderConfirmationPage from "../pages/buyer/OrderConfirmationPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import AnimalFormPage from "../pages/farmer/AnimalFormPage";
import FarmerOrdersPage from "../pages/farmer/FarmerOrdersPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/animal/:id" element={<AnimalDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Buyer + Both - must be logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Route>

      {/* Only farmers */}
      <Route element={<ProtectedRoute roles={['farmer']} />}>
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/add-animal" element={<AnimalFormPage />} />
        <Route path="/farmer/edit-animal/:id" element={<AnimalFormPage />} />
        <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
      </Route>

      {/* Only admins */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}