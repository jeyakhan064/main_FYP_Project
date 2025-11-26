import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';
import Header from '../components/Header';

const AdminOrders = () => {
  const snap = useSnapshot(authStore);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!snap.isAuthenticated || !snap.user?.isAdmin) {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [snap.isAuthenticated, snap.user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        headers: {
          'Authorization': `Bearer ${snap.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${snap.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Orders</h1>
              <p className="text-gray-600">View and manage all customer orders</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {statusOptions.map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
                  filterStatus === status
                    ? 'text-gray-900 shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                style={filterStatus === status ? { backgroundColor: '#EFBD48' } : {}}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status}
                {status !== 'All' && ` (${orders.filter(o => o.status === status).length})`}
              </motion.button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
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
                No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} orders found
              </h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#FFF9E6' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <React.Fragment key={order._id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-mono text-sm font-semibold text-gray-900">
                              {order._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-bold text-sm" style={{ color: '#EFBD48' }}>
                              Rs. {order.totalPrice.toLocaleString('en-PK')}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {order.isPaid ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Paid
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                order.status
                              )} focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              {expandedOrder === order._id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </motion.tr>

                        {/* Expanded Order Details */}
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan="8" className="px-4 py-4 bg-gray-50">
                              <div className="space-y-4">
                                {/* Order Items */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.orderItems.map((item, index) => (
                                      <div key={index} className="flex items-center gap-3 p-2 bg-white rounded">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                          <p className="text-xs text-gray-600">
                                            Qty: {item.quantity} × Rs. {item.price.toLocaleString('en-PK')}
                                          </p>
                                        </div>
                                        {item.isCustomized && (
                                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                                            Customized
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                  <div className="p-3 bg-white rounded text-sm">
                                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                                    <p className="text-gray-600">
                                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                                    <p className="text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
                                  </div>
                                </div>

                                {/* Payment Details */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                                  <div className="p-3 bg-white rounded text-sm">
                                    <p className="text-gray-600">
                                      Method: <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOrders;
