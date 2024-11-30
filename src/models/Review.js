import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    required: true
  },
  images: [{
    id: String,
    url: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  metadata: {
    verified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user's review on a product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Index for listing reviews by rating
reviewSchema.index({ productId: 1, rating: -1 });

// Update product rating when review is added/modified
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { productId: this.productId, status: 'approved' } },
    { 
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const Product = mongoose.model('Product');
  await Product.findByIdAndUpdate(this.productId, {
    'rating.average': stats[0]?.avgRating || 0,
    'rating.count': stats[0]?.count || 0
  });
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
