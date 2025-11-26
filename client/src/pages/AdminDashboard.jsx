import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import Header from '../components/Header';

const AdminDashboard = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!snap.isAuthenticated || !snap.user?.isAdmin) {
      navigate('/');
      return;
    }

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // Fetch all orders
        const ordersResponse = await fetch('http://localhost:8080/api/orders', {
          headers: {
            'Authorization': `Bearer ${snap.token}`,
          },
        });

        // Fetch all products
        const productsResponse = await fetch('http://localhost:8080/api/products');

        if (!ordersResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const ordersData = await ordersResponse.json();
        const products = await productsResponse.json();

        // Handle both old format (array) and new format (object with pagination)
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
        const totalOrders = ordersData.pagination ? ordersData.pagination.totalOrders : orders.length;

        // Calculate statistics
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;

        setStats({
          totalOrders,
          totalProducts: products.length,
          totalRevenue,
          pendingOrders,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [snap.isAuthenticated, snap.user, snap.token, navigate]);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '📦',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '👕',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString('en-PK')}`,
      icon: '💰',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Fashion Forge store</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{stat.icon}</div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl opacity-20`}></div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all"
                    style={{ backgroundColor: '#FFF9E6' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">
                      👕
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800">Manage Products</h3>
                      <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all"
                    style={{ backgroundColor: '#FFF9E6' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800">Manage Orders</h3>
                      <p className="text-sm text-gray-600">View and update order status</p>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
