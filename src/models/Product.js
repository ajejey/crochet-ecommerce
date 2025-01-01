import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../constants/product';

const WeightSchema = new mongoose.Schema({
  value: { type: Number, min: 0 },
  unit: { type: String, enum: ['g', 'oz'], default: 'g' }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index: true 
  },
  slug: { 
    type: String, 
    unique: true,
    index: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    index: true 
  },
  salePrice: { 
    type: Number,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    enum: PRODUCT_CATEGORIES.map(cat => cat.id),
    index: true 
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  material: { 
    type: String, 
    required: true 
  },
  size: { 
    type: String, 
    required: true 
  },
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUSES),
    default: PRODUCT_STATUSES.DRAFT,
    index: true
  },
  rating: {
    average: { type: Number, default: 0, index: true },
    count: { type: Number, default: 0 }
  },
  images: {
    type: [{
      url: String,
      id: String,
      isMain: Boolean
    }],
    required: true,
    validate: [arr => arr.length > 0, 'At least one image is required']
  },
  tags: [{ type: String, index: true }],
  description: {
    short: String,
    full: String
  },
  specifications: {
    weight: { type: WeightSchema },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    colors: [String],
    patterns: [String]
  },
  inventory: {
    stockCount: { type: Number, default: 0, required: true },
    lowStockThreshold: { type: Number, default: 5 },
    sku: { type: String, unique: true },
    allowBackorder: { type: Boolean, default: false }
  },
  metadata: {
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0, index: true },
    lastPurchased: Date,
    searchKeywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
ProductSchema.index({ status: 1, category: 1 });
ProductSchema.index({ status: 1, price: 1 });
ProductSchema.index({ status: 1, 'rating.average': -1 });
ProductSchema.index({ status: 1, 'metadata.salesCount': -1 });
ProductSchema.index({ status: 1, createdAt: -1 });

// Text index for search
ProductSchema.index({ 
  name: 'text', 
  'description.full': 'text', 
  tags: 'text' 
}, {
  weights: {
    name: 10,
    'description.full': 5,
    tags: 2
  }
});

// Virtual for reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId'
});

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // INR typically doesn't use decimal places
    minimumFractionDigits: 0
  }).format(this.price);
});

// Pre-save hook to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove hyphens from start and end
  }
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);