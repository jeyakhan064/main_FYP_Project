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
    model: "/models/womens_top.glb",
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
    <section className="max-w-7xl mx-auto p-6 md:p-12 pt-32">
      <motion.div className="text-center mb-16 mt-12" {...headTextAnimation}>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Explore Our Collection
        </h1>
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xl md:text-2xl font-bold leading-relaxed bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Discover Premium Fashion, Customized Your Way
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Browse through our curated selection of high-quality garments. Click any item to unleash your creativity with our 3D customization tool, or add it straight to your cart for instant purchase.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        {...headContentAnimation}
      >
        {allProducts.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleCardClick(item.model)}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-gray-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 relative"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-72 object-cover rounded-xl mb-5 bg-gray-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/threejs.png";
              }}
            />
            <h3 className="text-2xl font-bold mb-3 text-center text-gray-900">
              {item.name}
            </h3>
            <p className="text-center text-yellow-600 font-bold text-xl mb-4">
              Rs. {item.price.toLocaleString('en-PK')}
            </p>
            <motion.button
              onClick={(e) => handleAddToCart(item, e)}
              className="w-full text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 relative overflow-hidden text-lg"
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
