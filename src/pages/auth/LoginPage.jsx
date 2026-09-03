import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser, clearAuthError } from "../../features/auth/authSlice";
import farmHeroImage from "../../assets/farm-hero.png";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.justRegistered;
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [slowNotice, setSlowNotice] = useState(false);
  const slowTimerRef = useRef(null);

  // The backend can take up to ~60s to wake up from a cold start (Render
  // free tier). If login is still pending after a few seconds, let the
  // user know it's not frozen instead of leaving them staring at a spinner.
  useEffect(() => {
    if (loading) {
      slowTimerRef.current = setTimeout(() => setSlowNotice(true), 5000);
    } else {
      clearTimeout(slowTimerRef.current);
      setSlowNotice(false);
    }
    return () => clearTimeout(slowTimerRef.current);
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());

    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      const user = result.payload.user;
      if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/browse");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg overflow-hidden">
        <img src={farmHeroImage} alt="Farmland" className="h-40 w-full object-cover" />

        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">Farmart</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back to the marketplace.</p>
          </div>

          {justRegistered && !error && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg text-center py-2 mb-4">
              Account created! Log in to continue.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-green-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

            {slowNotice && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg text-center py-2">
                Still working — the server may be waking up after a period of inactivity. This can take up to a minute.
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-green-700 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}