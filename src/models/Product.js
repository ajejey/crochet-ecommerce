import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [false, 'Please provide a description for this product.'],
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  price: {
    type: Number,
    required: [false, 'Please provide a price for this product.'],
    maxlength: [5, 'Price cannot be more than 99999'],
  },
  images: {
    type: [String],
    required: [false, 'Please provide at least one image for this product.'],
  },
  category: {
    type: String,
    required: [false, 'Please specify the category of this product.'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);