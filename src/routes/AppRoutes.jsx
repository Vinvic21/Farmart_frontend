import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import BrowsePage from '../pages/buyer/BrowsePage';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage';
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import BrowseAnimalsPage from '../pages/BrowseAnimalsPage';

import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import DashboardPage from '../pages/farmer/DashboardPage';

import ProtectedRoute from '../components/ProtectedRoute';

function AnimalDetailPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Animal Details</h1>
      <p>Animal details will be displayed here.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/animals" element={<BrowseAnimalsPage />} /> 
      <Route path="/animals/:id" element={<AnimalDetailPage />} />

      {/* Protected Buyer Routes */}
      <Route path="/cart" element={<ProtectedRoute role="buyer"><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute role="buyer"><CheckoutPage /></ProtectedRoute>} />
      <Route path="/buyer/dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="buyer"><OrderHistoryPage /></ProtectedRoute>} />
  
      {/* Protected Farmer Route */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
    </Routes>
  );
}