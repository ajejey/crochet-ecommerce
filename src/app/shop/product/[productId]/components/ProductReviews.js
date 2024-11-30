'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { createReview } from '../../../actions';

export default function ProductReviews({ 
  productId, 
  initialReviews = {}, 
  reviewsCount: initialReviewsCount = 0,
  averageRating: initialAverageRating = 0
}) {
  const [reviews, setReviews] = useState(
    initialReviews?.reviews || initialReviews || []
  );
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [reviewsCount, setReviewsCount] = useState(initialReviewsCount);

  // Update average rating when reviews change
  useEffect(() => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / reviews.length);
      setReviewsCount(reviews.length);
    }
  }, [reviews]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createReview(
        productId,
        newReview.rating,
        newReview.comment
      );
      
      // Update reviews list with new review
      setReviews(prev => Array.isArray(prev) ? [result, ...prev] : [result]);
      setIsWritingReview(false);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviewsCount})
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => setIsWritingReview(true)}
            className="text-purple-600 hover:text-purple-700"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 ${
                i < Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xl font-medium">
          {averageRating ? averageRating.toFixed(1) : 'No reviews yet'}
        </span>
        <span className="text-gray-500">({reviewsCount} reviews)</span>
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= newReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                required
                className="w-full border rounded-lg p-2"
                placeholder="Share your thoughts about the product..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsWritingReview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </section>
  );
}
