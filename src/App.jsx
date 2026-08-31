import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import CheckoutPage from "./pages/buyer/CheckoutPage";
import OrderConfirmationPage from "./pages/buyer/OrderConfirmationPage";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-green-600">
              Farmart
            </Link>
            
            <div className="flex gap-6 items-center">
              <Link to="/browse" className="text-gray-700 hover:text-green-600 font-medium">Browse</Link>
              <Link to="/cart" className="text-gray-700 hover:text-green-600 font-medium">Cart</Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'buyer' && (
                    <Link to="/orders" className="text-gray-700 hover:text-green-600 font-medium">My Orders</Link>
                  )}
                  {user?.role === 'farmer' && (
                    <Link to="/farmer/dashboard" className="text-gray-700 hover:text-green-600 font-medium">Dashboard</Link>
                  )}
                  <span className="text-gray-600">Hi, {user?.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      <main>
        <AppRoutes />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-10 py-6 text-center text-gray-500">
        <p>© 2026 Farmart. Livestock Marketplace KE</p>
      </footer>
    </div>
  );
}

export default App;