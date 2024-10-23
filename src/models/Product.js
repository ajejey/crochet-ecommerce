import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: false },
  price: { type: Number, required: false },
  category: { type: String, required: false },
  material: { type: String, required: false },
  size: { type: String, required: false },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  images: { type: [String], required: false },
  tags: [String],
  description: String,
  stockCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);