import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';
import Header from '../components/Header';

const About = () => {
  const snap = useSnapshot(state);

  return (
    <>
      <Header />
      <div className="h-[72px]" /> {/* Spacer for header */}

      <motion.section
        className="max-w-4xl mx-auto p-8 md:p-12 bg-white rounded shadow-md mt-10"
        {...slideAnimation('up')}
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 mb-6"
          {...headTextAnimation}
        >
          About Fashion Forge
        </motion.h1>

        <motion.p
          className="text-gray-700 text-lg mb-6"
          {...headContentAnimation}
        >
          At <strong>Fashion Forge</strong>, we revolutionize the way you design and customize fashion products with cutting-edge 3D technology.
          Our platform lets you visualize your creations in stunning 3D, enabling you to tailor every detail with intuitive tools.
        </motion.p>

        <motion.ul
          className="list-disc list-inside text-gray-700 space-y-4"
          {...headContentAnimation}
        >
          <li>
            <strong>Interactive 3D View:</strong> Experience real-time 3D previews of your designs for a truly immersive customization process.
          </li>
          <li>
            <strong>Color Picker:</strong> Choose from a vibrant palette to make your designs pop with your signature colors.
          </li>
          <li>
            <strong>Image & File Upload:</strong> Upload your own artwork or patterns to add a personal touch to your creations.
          </li>
          <li>
            <strong>AI Styling Assistant:</strong> Get inspired by our innovative AI assistant that generates unique style suggestions based on a simple prompt.
          </li>
        </motion.ul>

        <motion.p
          className="mt-8 text-gray-700 text-lg"
          {...headContentAnimation}
        >
          Join us at Fashion Forge and unleash your creativity — where technology meets fashion innovation.
        </motion.p>
      </motion.section>
    </>
  );
};

export default About;
