import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../features/auth/authSlice';

const ROLES = [
  {
    value: 'farmer',
    label: 'Farmer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h2M4 18v-5l3-3h2l3 3v5M9 10V7a2 2 0 012-2h1M13 18h7M17 18v-4a3 3 0 00-3-3M6.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    value: 'buyer',
    label: 'Buyer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l-1-3H2M9 6V4a3 3 0 016 0v2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    ),
  },
];

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'buyer', // default role
  });

  const { name, phone, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (value) => {
    setFormData({ ...formData, role: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      // The backend doesn't log the user in on register (no tokens are
      // returned), so send them to log in with their new credentials.
      navigate('/login', { state: { justRegistered: true } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT PANEL — brand color instead of an image */}
        <div className="relative hidden md:flex flex-col justify-between bg-green-700 text-white p-8 overflow-hidden">
          {/* decorative background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 60% 70%, white 1.5px, transparent 1.5px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 text-xl font-bold">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 2c-4 3-6 6-6 10a6 6 0 0012 0c0-4-2-7-6-10z" />
              </svg>
              Farmart
            </div>
            <p className="text-green-100 text-sm mt-1">Connecting fields to tables.</p>
          </div>

          <div className="relative space-y-3">
            <h2 className="text-2xl font-semibold leading-snug">
              Join the modern marketplace for agricultural professionals.
            </h2>
            <p className="text-green-100 text-sm">
              Buy fresh, farm-raised livestock directly from trusted farmers, or list your own
              animals and reach buyers across the country — all in one place.
            </p>
          </div>

          <p className="relative text-xs text-green-200">
            © {new Date().getFullYear()} Farmart. Connecting fields to tables.
          </p>
        </div>

        {/* RIGHT PANEL — form */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Get started by filling out your details below.
          </p>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am joining as a:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const active = role === r.value;
                  return (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => selectRole(r.value)}
                      aria-pressed={active}
                      className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-3 text-xs font-medium transition-colors ${
                        active
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {r.icon}
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={onChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={onChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7-.4 1.1-1 2.2-1.8 3.2M6.2 6.6C4.2 8 2.8 9.9 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;