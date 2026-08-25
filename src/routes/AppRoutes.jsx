import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import BrowsePage from '../pages/buyer/BrowsePage';
import AnimalDetailPage from '../pages/buyer/AnimalDetailPage';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage';
import OrderConfirmationPage from '../pages/buyer/OrderConfirmationPage';

import DashboardPage from '../pages/farmer/DashboardPage';

import ProtectedRoute from '../features/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/animals/:id" element={<AnimalDetailPage />} />
      <Route path="/cart" element={<CartPage />} /> {/* public, per develop branch's decision */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

      <Route path="/farmer/dashboard" element={<DashboardPage />} />

      {/* Only logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;