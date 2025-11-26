import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import authStore, { forgotPassword } from '../store/authStore';
import Header from '../components/Header';

const ForgotPassword = () => {
  const snap = useSnapshot(authStore);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validate()) return;

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
      setEmail('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8"
            style={{ border: '2px solid #EFBD48' }}
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Enter your email to reset your password
            </p>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
                Password reset instructions have been sent to your email.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full px-4 py-3 border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition`}
                  placeholder="Enter your email"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={snap.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg font-bold text-gray-900 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#EFBD48' }}
              >
                {snap.loading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>

            {/* Back to Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Remember your password?{' '}
              <Link
                to="/signin"
                className="font-bold hover:underline"
                style={{ color: '#EFBD48' }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
