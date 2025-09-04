import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CustomButton } from '../components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';
import Header from '../components/Header';

const Contact = () => {
  const snap = useSnapshot(state);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Header />
      <div className="h-[72px]" /> {/* Spacer for header */}

      <motion.section
        className="max-w-3xl mx-auto p-6 md:p-12 bg-white rounded shadow-md mt-10"
        {...slideAnimation('up')}
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 mb-6"
          {...headTextAnimation}
        >
          Contact Us
        </motion.h1>

        <motion.p
          className="text-gray-700 mb-8"
          {...headContentAnimation}
        >
          We'd love to hear from you! Please fill out the form below to get in touch.
        </motion.p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-800" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <CustomButton
            type="filled"
            title="Send Message"
            handleClick={() => {}}
            customStyles="w-full py-3 font-bold text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
          />
        </form>
      </motion.section>
    </>
  );
};

export default Contact;
