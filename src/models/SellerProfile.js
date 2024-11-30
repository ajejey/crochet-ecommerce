import mongoose from 'mongoose';

const sellerProfileSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    unique: true,
    required: true,
    index: true
  },
  businessName: {
    type: String,
    required: true
  },
  description: String,
  contactEmail: String,
  phoneNumber: String,
  status: { 
    type: String, 
    enum: ['active', 'pending', 'suspended'],
    default: 'pending',
    index: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  metadata: {
    productsCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    rating: { 
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    featured: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for products
sellerProfileSchema.virtual('products', {
  ref: 'Product',
  localField: 'userId',
  foreignField: 'sellerId'
});

export const SellerProfile = mongoose.models.SellerProfile || mongoose.model('SellerProfile', sellerProfileSchema);
