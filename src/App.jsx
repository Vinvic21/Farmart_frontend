import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

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
              <Link to="/browse" className="text-gray-700 hover:text-green-600">Browse</Link>
              <Link to="/animals" className="text-gray-700 hover:text-green-600">Animals</Link>
              <Link to="/cart" className="text-gray-700 hover:text-green-600">Cart</Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'buyer' && (
                    <Link to="/buyer/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
                  )}
                  {user?.role === 'farmer' && (
                    <Link to="/farmer/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
                  )}
                  <span className="text-gray-600">Hi, {user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      <AppRoutes />
    </div>
  );
}

export default App;