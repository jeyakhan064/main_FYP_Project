import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { CustomButton } from "../components";
import Footer from "./Footer";
import authStore, { signout } from "../store/authStore";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";

const Home = () => {
  const navigate = useNavigate();
  const snap = useSnapshot(authStore);
  const [showDropdown, setShowDropdown] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignOut = () => {
    signout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Integrated Navigation */}
      <motion.section
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col"
        style={{
          backgroundImage: 'url("/assets/background.jpg")',
        }}
        {...slideAnimation("left")}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Transparent Navigation Bar with User Icon */}
        <motion.nav
          className="relative z-20 flex items-center justify-between px-8 py-6 bg-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo and Brand - Clickable to go home */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/logo.png"
              alt="Fashion Forge Logo"
              className="w-12 h-12 object-cover rounded-full border-2 border-yellow-400 shadow-lg"
            />
            <span className="text-white font-bold text-2xl drop-shadow-lg">Fashion Forge</span>
          </div>

          {/* Navigation Links and User Account */}
          <div className="hidden md:flex items-center space-x-8 font-semibold text-white text-lg">
            <button
              onClick={() => navigate('/explore')}
              className="hover:text-yellow-400 transition-colors drop-shadow-lg"
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-yellow-400 transition-colors drop-shadow-lg"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-yellow-400 transition-colors drop-shadow-lg"
            >
              Contact
            </button>

            {/* User Account Icon with Dropdown */}
            <div className="relative ml-4">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition-all hover:scale-110 shadow-lg"
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
          </div>
        </motion.nav>

        {/* Hero Content - Centered */}
        <div className="relative flex-1 flex items-center justify-center pt-4">
          <motion.div
            className="text-center px-6 z-10 max-w-5xl"
            {...headContainerAnimation}
          >
            <motion.div {...headTextAnimation}>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6">
                Make Your Own Brand
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mt-4 max-w-3xl mx-auto leading-relaxed">
                Design. Personalize. Wear your uniqueness.
              </p>
            </motion.div>

            <motion.div
              {...headContentAnimation}
              className="mt-12 flex gap-4 justify-center"
            >
              <motion.button
                onClick={() => navigate("/explore")}
                className="px-8 py-3 rounded-md font-bold text-base text-gray-900 shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: "#EFBD48" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Designing
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Decorative Divider */}
      <div className="relative h-20 bg-gradient-to-b from-black/10 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-lg"></div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Innovation Meets Fashion
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a new era of personalized fashion with our state-of-the-art design tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              className="group bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3D Customization</h3>
              <p className="text-gray-600 leading-relaxed">
                Bring your designs to life with our revolutionary 3D visualization technology.
                See every detail before you buy.
              </p>
            </motion.div>

            <motion.div
              className="group bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Intuitive Interface</h3>
              <p className="text-gray-600 leading-relaxed">
                Design like a pro with our user-friendly platform.
                No experience needed – just creativity and vision.
              </p>
            </motion.div>

            <motion.div
              className="group bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Unlock limitless possibilities with AI-generated patterns and designs.
                Innovation at your fingertips.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="relative h-16 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg"></div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-yellow-500"></div>
          </div>
        </div>
      </div>

      {/* Collection Showcase */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Premium Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of customizable apparel
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              className="relative overflow-hidden rounded-2xl h-96 w-full max-w-2xl group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => navigate("/explore")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/95 to-yellow-600/95" style={{ backgroundColor: '#EFBD48' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black p-8">
                <h3 className="text-5xl font-bold mb-4">Our Collection</h3>
                <p className="text-xl mb-6 text-center">Premium customizable apparel for every style</p>
                <motion.div
                  className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Collection
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Wave Divider */}
      <div className="relative h-24">
        <svg className="absolute bottom-0 w-full h-24 text-white" preserveAspectRatio="none" viewBox="0 0 1440 74">
          <path fill="currentColor" d="M0,0 C240,40 480,40 720,20 C960,0 1200,0 1440,20 L1440,74 L0,74 Z" style={{filter: 'drop-shadow(0 -4px 8px rgba(239, 189, 72, 0.2))'}}></path>
        </svg>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              About Fashion Forge
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At <strong>Fashion Forge</strong>, we revolutionize the way you design and customize fashion products with cutting-edge 3D technology.
              Our platform lets you visualize your creations in stunning 3D, enabling you to tailor every detail with intuitive tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6 text-gray-900">
                Redefining Fashion Customization
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Fashion Forge is more than a platform – it's a movement. We empower creators,
                designers, and fashion enthusiasts to break free from the ordinary and craft
                apparel that truly represents their identity.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With cutting-edge 3D technology and AI-powered design tools, we've made it
                effortless to create professional-quality custom clothing that stands out.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join us at Fashion Forge and unleash your creativity — where technology meets fashion innovation.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl text-center border-2 border-yellow-200">
                <h4 className="text-5xl font-bold text-gray-900 mb-2">10K+</h4>
                <p className="text-gray-700 font-semibold">Designs Created</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl text-center border-2 border-blue-200">
                <h4 className="text-5xl font-bold text-gray-900 mb-2">5K+</h4>
                <p className="text-gray-700 font-semibold">Happy Customers</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl text-center border-2 border-purple-200">
                <h4 className="text-5xl font-bold text-gray-900 mb-2">50+</h4>
                <p className="text-gray-700 font-semibold">Product Styles</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl text-center border-2 border-green-200">
                <h4 className="text-5xl font-bold text-gray-900 mb-2">24/7</h4>
                <p className="text-gray-700 font-semibold">Support</p>
              </div>
            </motion.div>
          </div>

          {/* Platform Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Interactive 3D View</h4>
                  <p className="text-gray-600 leading-relaxed">Experience real-time 3D previews of your designs for a truly immersive customization process.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Color Picker</h4>
                  <p className="text-gray-600 leading-relaxed">Choose from a vibrant palette to make your designs pop with your signature colors.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">Image & File Upload</h4>
                  <p className="text-gray-600 leading-relaxed">Upload your own artwork or patterns to add a personal touch to your creations.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">AI Styling Assistant</h4>
                  <p className="text-gray-600 leading-relaxed">Get inspired by our innovative AI assistant that generates unique style suggestions based on a simple prompt.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their fashion vision into reality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Fashion Forge transformed how I design. The 3D visualization is incredible!",
                author: "Sarah Chen",
                role: "Fashion Designer"
              },
              {
                quote: "Finally, a platform that lets me create exactly what I envision. Absolutely revolutionary.",
                author: "Marcus Johnson",
                role: "Streetwear Enthusiast"
              },
              {
                quote: "The AI design tools saved me hours. I created my brand's entire collection in days.",
                author: "Aliya Patel",
                role: "Brand Owner"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-200 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
              Let's Create Together
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Have a question or special request? We're here to help bring your vision to life.
            </p>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg text-center"
              >
                Thank you for reaching out! We'll get back to you within 24 hours.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="px-5 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="px-5 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                className="w-full px-5 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                required
                value={contactForm.message}
                onChange={handleContactChange}
                className="w-full px-5 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
              ></textarea>
              <div className="text-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 font-bold text-base rounded-lg transition-all"
                  style={{
                    backgroundColor: loading ? '#D1D5DB' : '#EFBD48',
                    color: loading ? '#6B7280' : '#000000'
                  }}
                  whileHover={!loading ? { scale: 1.05 } : {}}
                  whileTap={!loading ? { scale: 0.95 } : {}}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
