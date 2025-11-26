import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import authStore, { signout } from '../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const snap = useSnapshot(authStore);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavigation = (path) => {
    // Reset intro state when navigating
    if (path === '/explore') {
      state.intro = true;
    } else if (path === '/') {
      state.intro = true;
    }
    navigate(path);
  };

  const handleAboutClick = () => {
    // If we're on the home page, scroll to about section
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home and then scroll to about
      navigate('/');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSignOut = () => {
    signout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-3 shadow-md z-50"
      style={{ backgroundColor: "#EFBD48" }}
    >
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => handleNavigation('/')}
      >
        <motion.img
          src="/logo.png"
          alt="Fashion Forge Logo"
          className="w-10 h-10 object-cover rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.span
          className="text-black font-bold text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          Fashion Forge
        </motion.span>
      </div>
      <nav className="hidden md:flex items-center space-x-10 font-semibold text-black">
        {/* Navigation items can be added here if needed */}
      </nav>
      <div className="flex items-center relative">
        {/* Account Button */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-full hover:bg-yellow-500 hover:bg-opacity-20 transition-all duration-200"
          aria-label="User account"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A7.5 7.5 0 0112 15a7.5 7.5 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 bg-white rounded-lg shadow-2xl py-2 w-48 z-50"
              style={{ border: '2px solid #EFBD48' }}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {snap.isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {snap.user?.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {snap.user?.email}
                    </p>
                    {snap.user?.isAdmin && (
                      <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Admin Dashboard - Only show if user is admin */}
                  {snap.user?.isAdmin && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition font-semibold"
                    >
                      Admin Dashboard
                    </button>
                  )}

                  {/* My Orders */}
                  <button
                    onClick={() => {
                      navigate('/orders');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Orders
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In */}
                  <button
                    onClick={() => {
                      navigate('/signin');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Sign In
                  </button>

                  {/* Sign Up */}
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
