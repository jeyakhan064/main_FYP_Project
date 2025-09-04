import React from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import Header from '../components/Header';
import state from '../store';
import {
  slideAnimation,
  headTextAnimation,
  headContentAnimation
} from '../config/motion';

const items = [
  { id: 1, name: 'Ladies Puffer', description: 'Warm and stylish puffer jacket.', image: '/assets/ladies-puffer.avif' },
  { id: 2, name: 'Zipped Jacket', description: 'Classic zipped jacket for everyday wear.', image: '/assets/zipped-jacket.webp' },
  { id: 3, name: 'Oversize Sweatshirt', description: 'Comfortable and trendy oversize sweatshirt.', image: '/assets/oversize-sweatshirt.jpg' },
  { id: 4, name: 'Coat', description: 'Elegant coat for cold seasons.', image: '/assets/coat.jpg' },
  { id: 5, name: 'Hoodie', description: 'Casual and cozy hoodie.', image: '/assets/hoodie.jpg' },
  { id: 6, name: 'T-Shirt', description: 'Simple and versatile t-shirt.', image: '/assets/tshirt.webp' },
];

const Explore = () => {
  const snap = useSnapshot(state);

  return (
    <>
      <Header />
      <div className="h-[72px]" /> {/* spacer for fixed header */}

      <motion.section
        className="max-w-6xl mx-auto p-6 md:p-12 mt-10"
        {...slideAnimation('up')}
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 mb-8"
          {...headTextAnimation}
        >
          Explore Our Collection
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          {...headContentAnimation}
        >
          {items.map(({ id, name, description, image }) => (
            <motion.div
              key={id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer border border-gray-200 hover:border-yellow-500 transition flex flex-col"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{name}</h2>
              <p className="text-gray-600 flex-grow">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
};

export default Explore;
