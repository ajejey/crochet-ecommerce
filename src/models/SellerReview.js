import mongoose from 'mongoose';

const sellerReviewSchema = new mongoose.Schema({
  sellerId: {
    type: String,
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
  categories: {
    communication: { type: Number, min: 1, max: 5 },
    shipping: { type: Number, min: 1, max: 5 },
    productQuality: { type: Number, min: 1, max: 5 }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  metadata: {
    verified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for efficient querying of seller reviews
sellerReviewSchema.index({ sellerId: 1, createdAt: -1 });
sellerReviewSchema.index({ sellerId: 1, status: 1 });

// Virtual populate for user information
sellerReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Method to check if a user has already reviewed a seller
sellerReviewSchema.statics.hasUserReviewedSeller = async function(userId, sellerId) {
  const review = await this.findOne({ userId, sellerId });
  return !!review;
};

// Method to get seller's average ratings
sellerReviewSchema.statics.getSellerRatings = async function(sellerId) {
  const result = await this.aggregate([
    { $match: { sellerId, status: 'approved' } },
    { 
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        communicationAvg: { $avg: '$categories.communication' },
        shippingAvg: { $avg: '$categories.shipping' },
        productQualityAvg: { $avg: '$categories.productQuality' }
      }
    }
  ]);
  
  return result[0] || {
    averageRating: 0,
    totalReviews: 0,
    communicationAvg: 0,
    shippingAvg: 0,
    productQualityAvg: 0
  };
};

const SellerReview = mongoose.models.SellerReview || mongoose.model('SellerReview', sellerReviewSchema);

export default SellerReview;
