import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import BrowsePage from '../pages/buyer/BrowsePage';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage';
import OrderConfirmationPage from '../pages/buyer/OrderConfirmationPage';

import DashboardPage from '../pages/farmer/DashboardPage';

import AnimalDetailPage from '../pages/buyer/AnimalDetailPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/animals/:id" element={<AnimalDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

      <Route path="/farmer/dashboard" element={<DashboardPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
    </Routes>
  );
}

export default AppRoutes;
