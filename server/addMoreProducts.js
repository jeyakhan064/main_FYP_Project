import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const newProducts = [
  // Jackets (remaining ones)
  {
    name: "AGC Jacket",
    description: "Military-inspired tactical jacket with durable fabric",
    price: 8999,
    category: "jacket",
    modelPath: "/models/agc_jacket.glb",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    colors: ["#2C3E50", "#1C2833", "#34495E", "#7F8C8D"],
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    isCustomizable: true,
    isFeatured: false
  },
  {
    name: "Cloth Jacket",
    description: "Lightweight cloth jacket perfect for layering",
    price: 6999,
    category: "jacket",
    modelPath: "/models/cloth_jacket.glb",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=500",
    colors: ["#8B4513", "#A0522D", "#D2691E", "#CD853F"],
    sizes: ["S", "M", "L", "XL"],
    stock: 60,
    isCustomizable: true,
    isFeatured: false
  },
  {
    name: "Hooded Jacket",
    description: "Comfortable hooded jacket for casual wear",
    price: 7499,
    category: "jacket",
    modelPath: "/models/hooded_jacket.glb",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    colors: ["#000000", "#2C3E50", "#E74C3C", "#3498DB"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 80,
    isCustomizable: true,
    isFeatured: false
  },
  {
    name: "Indiana Jones Coat",
    description: "Classic adventure-style leather coat",
    price: 14999,
    category: "jacket",
    modelPath: "/models/indiana_jones_wested_leather_coat.glb",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    colors: ["#8B4513", "#654321", "#A0522D"],
    sizes: ["M", "L", "XL"],
    stock: 30,
    isCustomizable: true,
    isFeatured: true
  },
  {
    name: "Jean Jacket",
    description: "Classic denim jacket for everyday style",
    price: 5999,
    category: "jacket",
    modelPath: "/models/jean_jacket.glb",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500",
    colors: ["#1E3A8A", "#3B82F6", "#6B7280", "#111827"],
    sizes: ["S", "M", "L", "XL"],
    stock: 100,
    isCustomizable: true,
    isFeatured: false
  },

  // Shirts & Hoodies
  {
    name: "Women's Top",
    description: "Stylish and comfortable women's shirt",
    price: 3999,
    category: "shirt",
    modelPath: "/models/womens_top.glb",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    colors: ["#FFFFFF", "#FFB6C1", "#87CEEB", "#98FB98"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 120,
    isCustomizable: true,
    isFeatured: true
  },

  // Pants
  {
    name: "The Pants",
    description: "Versatile pants for any occasion",
    price: 4999,
    category: "pants",
    modelPath: "/models/the_pants.glb",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
    colors: ["#000000", "#2C3E50", "#8B4513", "#708090"],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 90,
    isCustomizable: true,
    isFeatured: false
  }
];

const addProducts = async () => {
  try {
    await connectDB();

    // Add only new products (check if they don't exist)
    for (const product of newProducts) {
      const exists = await Product.findOne({ name: product.name });
      if (!exists) {
        await Product.create(product);
        console.log(`✅ Added: ${product.name}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${product.name}`);
      }
    }

    console.log('\n✅ All products processed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

addProducts();
