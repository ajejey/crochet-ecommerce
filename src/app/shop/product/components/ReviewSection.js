'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, Loader2 } from 'lucide-react';
import { getProductReviews, createReview } from '../../actions';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/utils/format';

export default function ReviewSection({ productId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews.reviews);
  const [pagination, setPagination] = useState(initialReviews.pagination);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { ref, inView } = useInView();

  const loadMoreReviews = async () => {
    if (isLoading || !pagination.hasMore) return;

    setIsLoading(true);
    try {
      const result = await getProductReviews(productId, pagination.currentPage + 1);
      setReviews(prev => [...prev, ...result.reviews]);
      setPagination(result.pagination);
    } catch (error) {
      toast.error('Failed to load more reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("submitting review ", productId, newReview.rating, newReview.comment)
      // Call the server action to create a review
      const result = await createReview(
        productId,
        newReview.rating,
        newReview.comment
      );

      console.log("review result ", result)

      if (result.success) {
        // Add the new review to the top of the list
        setReviews(prev => [result.review, ...prev]);
        // Reset the form
        setNewReview({ rating: 5, comment: '' });
        toast.success('Review submitted successfully!');
      } else {
        // Show error message from the server
        toast.error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load more reviews when scrolling to the bottom
  if (inView) {
    loadMoreReviews();
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {/* Review Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        
        {/* Rating Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= newReview.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts about this product..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="w-full bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">{review.userName}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}

        {/* Load More */}
        {pagination.hasMore && (
          <div ref={ref} className="flex justify-center py-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more reviews...</span>
              </div>
            ) : (
              <button
                onClick={loadMoreReviews}
                className="text-blue-600 hover:text-blue-800"
              >
                Load More Reviews
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
