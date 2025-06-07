import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price cannot be negative'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    trim: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  deliveryTime: {
    type: Number, // estimated days
    default: 3,
  },
  affiliateLink: {
    type: String,
    trim: true,
  },
  vehicleCompatibility: {
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    }
  },
  cityAvailability: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Product', productSchema); 