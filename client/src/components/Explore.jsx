import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import state, { setSelectedModel } from "../store";
import { addToCart } from "../store/cartStore";
import {
  slideAnimation,
  headTextAnimation,
  headContentAnimation,
} from "../config/motion";

// ALL PRODUCTS IN ONE COLLECTION
const allProducts = [
  {
    id: 1,
    name: "AGC Jacket",
    image: "/products/agc-jacket.png",
    model: "/models/agc_jacket.glb",
    price: 2999,
    productId: null,
  },
  {
    id: 2,
    name: "Cloth Jacket",
    image: "/products/cloth-jacket.png",
    model: "/models/cloth_jacket.glb",
    price: 3499,
    productId: null,
  },
  {
    id: 3,
    name: "Hooded Jacket",
    image: "/products/hooded-jacket.png",
    model: "/models/hooded_jacket.glb",
    price: 3999,
    productId: null,
  },
  {
    id: 4,
    name: "Indiana Jones Coat",
    image: "/products/indiana-jones-coat.png",
    model: "/models/indiana_jones_wested_leather_coat.glb",
    price: 4000,
    productId: null,
  },
  {
    id: 5,
    name: "Jean Jacket",
    image: "/products/jean-jacket.png",
    model: "/models/jean_jacket.glb",
    price: 2499,
    productId: null,
  },
  {
    id: 6,
    name: "Varsity Jacket",
    image: "/products/varsity-jacket.png",
    model: "/models/varsity_jacket.glb",
    price: 3799,
    productId: null,
  },
  {
    id: 7,
    name: "T-Shirt",
    image: "/products/tshirt.png",
    model: "/models/shirt_baked.glb",
    price: 1999,
    productId: null,
  },
  {
    id: 8,
    name: "Women's Top",
    image: "/products/womens-top.png",
    model: "/models/womens_shirt.glb",
    price: 2199,
    productId: null,
  },
  {
    id: 9,
    name: "Hoodie",
    image: "/products/hoodie.png",
    model: "/models/hoodie.glb",
    price: 2899,
    productId: null,
  },
  {
    id: 10,
    name: "The Pants",
    image: "/products/pants.png",
    model: "/models/the_pants.glb",
    price: 2699,
    productId: null,
  },
];

const Explore = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = React.useState(null);

  // When a card is clicked, set the model and navigate to customizer
  const handleCardClick = (modelPath) => {
    setSelectedModel(modelPath);
    state.intro = false;
    navigate('/customizer');
  };

  // Add to cart handler with visual feedback
  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addToCart(item);

    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto p-6 md:p-12 pt-24">
      <motion.h1
        className="text-4xl font-extrabold text-gray-900 mb-12 text-center mt-8"
        {...headTextAnimation}
      >
        Explore Our Collection
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        {...headContentAnimation}
      >
        {allProducts.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCardClick(item.model)}
            className="bg-white rounded-xl shadow-md p-4 cursor-pointer border border-gray-200 hover:border-yellow-500 transition relative"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md mb-4 bg-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/threejs.png";
              }}
            />
            <h3 className="text-xl font-semibold mb-2 text-center">
              {item.name}
            </h3>
            <p className="text-center text-yellow-600 font-bold text-lg mb-3">
              Rs. {item.price.toLocaleString('en-PK')}
            </p>
            <motion.button
              onClick={(e) => handleAddToCart(item, e)}
              className="w-full text-black font-semibold py-2 px-4 rounded-lg transition-all duration-200 relative overflow-hidden"
              style={{ backgroundColor: addedToCart === item.id ? "#10B981" : "#EFBD48" }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 189, 72, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {addedToCart === item.id ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  ✓ Added to Cart
                </motion.span>
              ) : (
                "Add to Cart"
              )}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Explore;
