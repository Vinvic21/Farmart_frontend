import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../features/auth/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer', // default role
  });

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/'); // redirect after register
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* ROLE SELECTOR - This is the key part for Task 2 */}
        <div>
          <label className="block mb-2 font-semibold">I am a:</label>
          <select
            name="role"
            value={role}
            onChange={onChange}
            className="w-full p-2 border rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-green-600">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;