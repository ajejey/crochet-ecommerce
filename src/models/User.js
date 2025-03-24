import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  appwriteId: { 
    type: String, 
    unique: true,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  name: String,
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'],
    default: 'user',
    index: true
  },
  phone: String,
  // shippingAddress: String,
  // shippingCity: String,
  // shippingState: String,
  // shippingPincode: String,
  addresses: [
    {
      address: String,
      city: String,
      state: String,
      pincode: String
    }
  ],
  lastSync: Date,
  metadata: {
    lastLogin: Date,
    loginCount: Number,
    preferences: {
      newsletter: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for seller profile
userSchema.virtual('sellerProfile', {
  ref: 'SellerProfile',
  localField: 'appwriteId',
  foreignField: 'userId',
  justOne: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
