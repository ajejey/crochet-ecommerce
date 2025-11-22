import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  appwriteId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values, makes it optional
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      // Password required if no appwriteId (for new users)
      return !this.appwriteId;
    }
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
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
