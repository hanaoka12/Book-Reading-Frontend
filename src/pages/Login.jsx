import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload();
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#7c98b3] py-4 px-6"> {/* Reduced from py-6 px-8 */}
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back!</h2> {/* Reduced from text-3xl */}
            <p className="mt-1 text-center text-gray-100 text-sm">Sign in to continue reading</p> {/* Added text-sm and reduced mt-2 to mt-1 */}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`
                  w-full py-3 px-4 rounded-lg text-white font-medium
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${loading ? 
                    'bg-blue-400 cursor-not-allowed' : 
                    'bg-blue-500 hover:bg-blue-600 active:scale-[0.98]'
                  }
                `}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : 'Sign In'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
