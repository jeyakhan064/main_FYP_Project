import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const products = [
  {
    name: "AGC Jacket",
    description: "Stylish AGC jacket with full 3D customization. Choose colors, add logos, and create your perfect look.",
    price: 2999,
    category: "jacket",
    modelPath: "/models/agc_jacket.glb",
    image: "/products/agc-jacket.png",
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#EFBD48"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 100,
    isCustomizable: true,
    isFeatured: true,
  },
  {
    name: "Cloth Jacket",
    description: "Comfortable cloth jacket with customization options. Perfect for everyday wear.",
    price: 3499,
    category: "jacket",
    modelPath: "/models/cloth_jacket.glb",
    image: "/products/cloth-jacket.png",
    colors: ["#FFFFFF", "#000000", "#808080", "#EFBD48"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 75,
    isCustomizable: true,
    isFeatured: false,
  },
  {
    name: "Hooded Jacket",
    description: "Stylish hooded jacket with full customization. Add your personal touch to this versatile piece.",
    price: 3999,
    category: "jacket",
    modelPath: "/models/hooded_jacket.glb",
    image: "/products/hooded-jacket.png",
    colors: ["#000000", "#808080", "#FFFFFF", "#EFBD48"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 80,
    isCustomizable: true,
    isFeatured: true,
  },
  {
    name: "Indiana Jones Coat",
    description: "Iconic adventurer coat with customization options. Make your own legendary style statement.",
    price: 4000,
    category: "jacket",
    modelPath: "/models/indiana_jones_wested_leather_coat.glb",
    image: "/products/indiana-jones-coat.png",
    colors: ["#8B4513", "#654321", "#A0522D"],
    sizes: ["M", "L", "XL"],
    stock: 40,
    isCustomizable: true,
    isFeatured: true,
  },
  {
    name: "Jean Jacket",
    description: "Classic denim jacket with customization options. Add patches, change colors, and make it yours.",
    price: 2499,
    category: "jacket",
    modelPath: "/models/jean_jacket.glb",
    image: "/products/jean-jacket.png",
    colors: ["#4169E1", "#000080", "#808080"],
    sizes: ["S", "M", "L", "XL"],
    stock: 90,
    isCustomizable: true,
    isFeatured: false,
  },
  {
    name: "Varsity Jacket",
    description: "Classic varsity jacket with customizable patches and colors. Perfect for school spirit or personal style.",
    price: 3799,
    category: "jacket",
    modelPath: "/models/varsity_jacket.glb",
    image: "/products/varsity-jacket.png",
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 60,
    isCustomizable: true,
    isFeatured: false,
  },
  {
    name: "T-Shirt",
    description: "Classic customizable t-shirt with our 3D designer. Choose colors, add logos, and create your perfect look.",
    price: 1999,
    category: "shirt",
    modelPath: "/models/shirt_baked.glb",
    image: "/products/tshirt.png",
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#EFBD48"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 120,
    isCustomizable: true,
    isFeatured: true,
  },
  {
    name: "Women's Top",
    description: "Customize your own unique women's shirt with our 3D designer. Choose colors, add logos, and create your perfect look.",
    price: 2199,
    category: "shirt",
    modelPath: "/models/womens_shirt.glb",
    image: "/products/womens-top.png",
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#EFBD48"],
    sizes: ["S", "M", "L", "XL"],
    stock: 100,
    isCustomizable: true,
    isFeatured: false,
  },
  {
    name: "Hoodie",
    description: "Cozy and customizable hoodie. Perfect for casual wear with full 3D customization options.",
    price: 2899,
    category: "hoodie",
    modelPath: "/models/hoodie.glb",
    image: "/products/hoodie.png",
    colors: ["#000000", "#808080", "#FFFFFF", "#EFBD48"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 85,
    isCustomizable: true,
    isFeatured: false,
  },
  {
    name: "The Pants",
    description: "Stylish customizable pants. Perfect for completing your custom outfit with personalized touches.",
    price: 2699,
    category: "pants",
    modelPath: "/models/the_pants.glb",
    image: "/products/pants.png",
    colors: ["#000000", "#2F4F2F", "#808080", "#000080"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 70,
    isCustomizable: true,
    isFeatured: false,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany();
    console.log('Products cleared');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    console.log(`${products.length} products added to database`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
