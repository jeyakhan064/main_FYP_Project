import React from "react";
import { motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import {
  slideAnimation,
  headTextAnimation,
  headContentAnimation,
} from "../config/motion";

const ladiesItems = [
  {
    id: 1,
    name: "Ladies Puffer",
    image: "/assets/ladies-puffer.avif",
    model: "/models/womens_shirt.glb",
  },
  {
    id: 2,
    name: "Zipped Jacket",
    image: "/assets/zipped-jacket.webp",
    model: "/models/zipped-jacket.glb",
  },
  {
    id: 3,
    name: "Oversize Sweatshirt",
    image: "/assets/oversize-sweatshirt.jpg",
    model: "/models/oversize-sweatshirt.glb",
  },
  { id: 4, name: "Coat", image: "/assets/coat.jpg", model: "/models/coat.glb" },
  {
    id: 5,
    name: "Hoodie",
    image: "/assets/hoodie.jpg",
    model: "/models/hoodie.glb",
  },
  {
    id: 6,
    name: "T-Shirt",
    image: "/assets/tshirt.webp",
    model: "/shirt_baked.glb",
  },
];

const menItems = [
  {
    id: 7,
    name: "Denim Jacket",
    image: "/assets/men-denim.jpg",
    model: "/models/men-denim.glb",
  },
  {
    id: 8,
    name: "Leather Jacket",
    image: "/assets/men-leather.jpg",
    model: "/models/men-leather.glb",
  },
  {
    id: 9,
    name: "Sweatshirt",
    image: "/assets/men-sweatshirt.jpg",
    model: "/models/men-sweatshirt.glb",
  },
  {
    id: 10,
    name: "Casual Shirt",
    image: "/assets/men-shirt.jpg",
    model: "/models/men-shirt.glb",
  },
];

const kidsItems = [
  {
    id: 13,
    name: "Kids Hoodie",
    image: "/assets/kids-hoodie.jpg",
    model: "/models/kids-hoodie.glb",
  },
  {
    id: 14,
    name: "Kids T-Shirt",
    image: "/assets/kids-tshirt.jpg",
    model: "/models/kids-tshirt.glb",
  },
  {
    id: 15,
    name: "Kids Jacket",
    image: "/assets/kids-jacket.jpg",
    model: "/models/kids-jacket.glb",
  },
];

const Explore = () => {
  const snap = useSnapshot(state);

  const handleCardClick = (modelPath) => {
    state.selectedModel = modelPath; // 👈 set model dynamically
    state.intro = false; // show Canvas
  };

  const renderSection = (title, items) => (
    <motion.div className="mb-16" {...slideAnimation("up")}>
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-yellow-500 pl-3"
        {...headTextAnimation}
      >
        {title}
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        {...headContentAnimation}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCardClick(item)}
            className="bg-white rounded-xl shadow-md p-4 cursor-pointer border border-gray-200 hover:border-yellow-500 transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-center">
              {item.name}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  return (
    <section className="max-w-6xl mx-auto p-6 md:p-12 mt-10">
      <motion.h1
        className="text-4xl font-extrabold text-gray-900 mb-12 text-center"
        {...headTextAnimation}
      >
        Explore Our Collection
      </motion.h1>

      {renderSection("Ladies Collection", ladiesItems)}
      {renderSection("Men’s Collection", menItems)}
      {renderSection("Kids Collection", kidsItems)}
    </section>
  );
};

export default Explore;
