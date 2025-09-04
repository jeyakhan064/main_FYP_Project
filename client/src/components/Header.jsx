import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-3 shadow-md z-50"
      style={{ backgroundColor: "#EFBD48" }}
    >
      <div className="flex items-center space-x-3">
        <img src="./threejs.png" alt="logo" className="w-10 h-10 object-contain" />
        <span className="text-black font-bold text-xl">Fashion Forge</span>
      </div>
      <nav className="hidden md:flex items-center space-x-10 font-semibold text-black">
      <div className="flex space-x-10">
        <Link to="/" className="hover:text-yellow-800 transition">Home</Link>
        <Link to="/explore" className="hover:text-yellow-800 transition">Explore</Link>
        {/* <Link to="/customizer" className="hover:text-yellow-800 transition">Customizer</Link> */}
        <Link to="/about" className="hover:text-yellow-800 transition">About Us</Link>
        <Link to="/contact" className="hover:text-yellow-800 transition">Contact Us</Link>
      </div>
      
    </nav>
    <div className="ml-10 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded border border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black w-48"
        />
        <button
          type="button"
          className="relative p-2 rounded hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="View cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="7" cy="21" r="1" />
            <circle cx="17" cy="21" r="1" />
          </svg>
        </button>

        {/* Account Button */}
        <button
          type="button"
          className="p-2 rounded hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
      </div>
    </header>
  );
};

export default Header;
