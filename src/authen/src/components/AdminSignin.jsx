import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const AdminSignin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { session, signInUser } = UserAuth();
  console.log(session);
  console.log(email, password);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInUser(email, password, true);
      if (result.success) {
        navigate('/AdminDashboard');
      } else {
        setError(result.error || 'Failed to sign in as admin.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSignIn} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2 text-purple-400">Admin Sign In</h2>
        <p>
          Not an admin? <Link to="/Signin" className="text-purple-400 hover:underline">Regular Sign In</Link>
        </p>
        <div className="flex flex-col py-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className="p-3 mt-6 border border-gray-300 rounded"
            type="email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="p-3 mt-6 border border-gray-300 rounded"
            type="password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading ? 'Signing In...' : 'Admin Sign In'}
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
      <div className="absolute bottom-4 right-4">
        <Link to="/Signin">
          <button className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700">
            Regular Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminSignin;