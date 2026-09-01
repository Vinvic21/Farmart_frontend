import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  };

  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  // No "name" field exists on the user yet — use the part of the email
  // before the @ as a friendly display name (e.g. john@gmail.com -> john).
  const displayName = user?.email?.split("@")[0] || "";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="font-display text-2xl font-bold text-farmart-green-deep">
            Farmart
          </Link>

          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="hidden md:flex gap-6 items-center">
            <Link to="/browse" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
              Browse
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-farmart-amber text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "buyer" && (
                  <Link to="/orders" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
                    My Orders
                  </Link>
                )}
                {user?.role === "farmer" && (
                  <Link to="/farmer/dashboard" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
                  Profile
                </Link>
                <span className="text-gray-400 text-sm truncate max-w-[140px]">Hi, {displayName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-farmart-green-deep font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-farmart-green-deep text-white px-4 py-2 rounded-lg hover:bg-farmart-green-deep/90 font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/browse" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Browse</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Cart {cartCount > 0 && `(${cartCount})`}</Link>
            {isAuthenticated ? (
              <>
                {user?.role === "buyer" && (
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">My Orders</Link>
                )}
                {user?.role === "farmer" && (
                  <Link to="/farmer/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Dashboard</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Admin</Link>
                )}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">My Profile</Link>
                <span className="text-gray-400 text-sm">Hi, {displayName}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-farmart-green-deep text-white px-4 py-2 rounded-lg font-medium text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}