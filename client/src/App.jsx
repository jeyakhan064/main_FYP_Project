import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CustomizerPage from './pages/CustomizerPage';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import { FloatingCart, CartModal } from './components';
import { getCurrentUser } from './store/authStore';

function App() {
  // Check if user is already logged in on app load
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <main className="app transition-all ease-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>

      {/* Global Cart Components */}
      <FloatingCart />
      <CartModal />
    </main>
  );
}

export default App;
