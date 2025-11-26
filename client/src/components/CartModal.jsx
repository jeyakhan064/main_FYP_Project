import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import { useNavigate } from "react-router-dom";
import cartStore, {
  toggleCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/cartStore";
import authStore from "../store/authStore";
import { CustomButton } from "./index";

const CartModal = () => {
  const snap = useSnapshot(cartStore);
  const authSnap = useSnapshot(authStore);
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: authSnap.user?.name || "",
    email: authSnap.user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "Cash on Delivery",
  });


  const handleCheckout = () => {
    // Check if user is logged in
    if (!authSnap.isAuthenticated) {
      toggleCart();
      navigate('/signin');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        orderItems: snap.items.map(item => ({
          product: item.productId || null,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'M',
          color: item.color || '#FFFFFF',
          isCustomized: item.isCustomized || false,
          customization: item.customization || null,
        })),
        shippingAddress: {
          fullName: customerInfo.name,
          address: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          country: customerInfo.country,
          phone: customerInfo.phone,
        },
        paymentMethod: customerInfo.paymentMethod,
        itemsPrice: snap.totalPrice,
        shippingPrice: 0, // Free shipping
        taxPrice: 0,
        totalPrice: snap.totalPrice,
      };

      // Send order to backend
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSnap.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success!
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        setShowCheckout(false);
        setOrderPlaced(false);
        toggleCart();
        // Navigate to order history
        navigate('/orders');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {snap.isCartOpen && (
        <>
          {/* Backdrop with smooth fade */}
          <motion.div
            className="fixed inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={toggleCart}
          />

          {/* Cart Modal - Positioned Top Right */}
          <motion.div
            className="fixed right-6 top-24 h-[85vh] w-[90vw] md:w-[480px] bg-gradient-to-br from-gray-50 to-white shadow-2xl z-50 overflow-hidden flex flex-col rounded-2xl"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            {/* Header with gradient */}
            <div
              className="sticky top-0 p-6 flex justify-between items-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #EFBD48 0%, #f0c962 100%)",
              }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Cart
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  {snap.totalItems} {snap.totalItems === 1 ? "item" : "items"}
                </p>
              </div>
              <motion.button
                onClick={toggleCart}
                className="p-2 hover:bg-yellow-600 rounded-full transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {!showCheckout ? (
              <>
                {/* Cart Items - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  {snap.items.length === 0 ? (
                    <motion.div
                      className="text-center py-20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.div
                        className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
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
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-500">
                        Add some items to get started
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {snap.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{
                              layout: { type: "spring", stiffness: 300, damping: 30 },
                              opacity: { duration: 0.2 },
                              x: { duration: 0.2 },
                            }}
                            className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-yellow-600 font-bold text-lg mt-1">
                                Rs. {item.price.toLocaleString("en-PK")}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 mt-3">
                                <motion.button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  -
                                </motion.button>
                                <span className="px-4 font-semibold text-gray-900 min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <motion.button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-2 h-fit"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Footer with Total */}
                {snap.items.length > 0 && (
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg">
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs. {snap.totalPrice.toLocaleString("en-PK")}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span
                          className="font-bold"
                          style={{ color: "#EFBD48" }}
                        >
                          Rs. {snap.totalPrice.toLocaleString("en-PK")}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleCheckout}
                      className="w-full py-4 rounded-xl font-semibold text-gray-900 shadow-md hover:shadow-lg transition-all"
                      style={{ backgroundColor: "#EFBD48" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              /* Checkout Form */
              <div className="flex-1 overflow-y-auto p-6">
                {orderPlaced ? (
                  <motion.div
                    className="text-center py-20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <motion.div
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-green-600 mb-3">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Thank you for your purchase. You'll receive a confirmation
                      email shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">
                        Checkout Details
                      </h3>
                      {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-4">
                          {error}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Street Address *
                      </label>
                      <textarea
                        required
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            address: e.target.value,
                          })
                        }
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                        placeholder="Street address, apartment number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.city}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, city: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                          placeholder="Karachi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.postalCode}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, postalCode: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                          placeholder="75500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        Payment Method
                      </label>
                      <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Cash on Delivery
                            </h4>
                            <p className="text-sm text-gray-600">
                              Pay with cash when your order is delivered. Please keep exact change ready.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span>Rs. {snap.totalPrice.toLocaleString("en-PK")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span className="text-green-600 font-semibold">FREE</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-xl font-bold">
                          <span>Total Amount</span>
                          <span style={{ color: "#EFBD48" }}>
                            Rs. {snap.totalPrice.toLocaleString("en-PK")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ← Back to Cart
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-semibold text-gray-900 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#EFBD48" }}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Placing Order...' : 'Place Order'}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
