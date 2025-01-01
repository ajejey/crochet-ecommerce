'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import useSWR from 'swr';
import { getProductReviews } from '../../../actions';

export default function ProductReviews({ productId, initialReviews }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { data: reviews } = useSWR(
    `/api/products/${productId}/reviews`,
    () => getProductReviews(productId),
    { 
      fallbackData: initialReviews,
      revalidateOnMount: true 
    }
  );

  // Ensure reviews is an array and has items
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const hasReviews = reviewsList.length > 0;

  // Calculate average rating only if there are reviews
  const averageRating = hasReviews 
    ? reviewsList.reduce((acc, review) => acc + (review?.rating || 0), 0) / reviewsList.length 
    : 0;

  if (!hasReviews) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-gray-300"
                fill="none"
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">No reviews yet</span>
          </div>
          <button
            onClick={() => setShowReviewForm(true)}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            Write a review
          </button>
        </div>

        {showReviewForm ? (
          <ReviewForm productId={productId} onClose={() => setShowReviewForm(false)} />
        ) : (
          <p className="text-sm text-gray-500">
            Be the first to review this product!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= averageRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm">
            {averageRating.toFixed(1)} ({reviewsList.length} {reviewsList.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        <button
          onClick={() => setShowReviewForm(true)}
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          Write a review
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm productId={productId} onClose={() => setShowReviewForm(false)} />
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviewsList.map((review) => (
          <div key={review.id || Math.random()} className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (review?.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{review?.title || 'Review'}</span>
              </div>
              <span className="text-xs text-gray-500">
                {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <p className="text-sm text-gray-600">{review?.comment || ''}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span className="font-medium">{review?.userName || 'Anonymous'}</span>
              {review?.verifiedPurchase && (
                <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded">
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ productId, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form className="border rounded-lg p-4 space-y-4 bg-gray-50">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 -m-1"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hover || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Summarize your review"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Review</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg text-sm"
          rows="3"
          placeholder="Share your experience with this product"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}
