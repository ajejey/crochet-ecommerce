import mongoose from 'mongoose';

const socialProofEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['purchase', 'cart_add', 'view', 'new_arrival', 'low_stock', 'review', 'wishlist_add', 'new_seller'],
    required: true
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  productImage: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName: { type: String },
  location: { type: String },
  quantity: { type: Number },
  timestamp: { type: Date, default: Date.now, expires: '7d' } // TTL index - events expire after 7 days
}, { timestamps: true });

// Create index for efficient querying
socialProofEventSchema.index({ type: 1, timestamp: -1 });

export default mongoose.models.SocialProofEvent || mongoose.model('SocialProofEvent', socialProofEventSchema);
