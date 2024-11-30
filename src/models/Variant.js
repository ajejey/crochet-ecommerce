import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price_adjustment: {
    type: Number,
    required: true,
    default: 0
  },
  stockCount: {
    type: Number,
    required: true,
    default: 0
  },
  sku: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for product and name uniqueness
variantSchema.index({ product: 1, name: 1 }, { unique: true });

export const Variant = mongoose.models.Variant || mongoose.model('Variant', variantSchema);
