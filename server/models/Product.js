import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['shirt', 'jacket', 'hoodie', 'pants', 'accessories'],
    },
    modelPath: {
      type: String,
      required: [true, 'Please add a 3D model path'],
    },
    image: {
      type: String,
      required: [true, 'Please add a product image'],
    },
    colors: {
      type: [String],
      default: ['#FFFFFF', '#000000', '#FF0000', '#0000FF'],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
