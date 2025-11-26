import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import Header from '../components/Header';

const Orders = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!snap.isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Fetch user's orders with timeout
    const fetchOrders = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch('http://localhost:8080/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${snap.token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        // Handle both old format (array) and new format (object with pagination)
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timeout - server is taking too long to respond');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [snap.isAuthenticated, snap.token, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
      'Delivered': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order History</h1>
          <p className="text-gray-600 mb-8">Track and manage your orders</p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here
              </p>
              <motion.button
                onClick={() => navigate('/explore')}
                className="px-8 py-3 rounded-lg font-bold text-gray-900 shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#EFBD48' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Products
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  style={{ border: '2px solid #EFBD48' }}
                >
                  {/* Order Header */}
                  <div
                    className="p-6 flex flex-wrap gap-4 justify-between items-center"
                    style={{ backgroundColor: '#FFF9E6' }}
                  >
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-mono font-semibold text-gray-900">
                        {order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-bold text-xl" style={{ color: '#EFBD48' }}>
                        Rs. {order.totalPrice.toLocaleString('en-PK')}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × Rs.{' '}
                              {item.price.toLocaleString('en-PK')}
                            </p>
                            {item.isCustomized && (
                              <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                                Customized
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-gray-900">
                            Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-gray-700">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.shippingAddress.country}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>

                    {/* Payment Info */}
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Payment Method: </span>
                        <span className="font-semibold text-gray-900">
                          {order.paymentMethod}
                        </span>
                      </div>
                      {order.isPaid ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Paid
                        </span>
                      ) : (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                          Pending Payment
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;
