'use client';

import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import Pagination from '@/app/components/Pagination';

export default function CreatorReviews({ initialReviews, creatorId }) {
  const [reviews, setReviews] = useState(initialReviews.reviews);
  const [pagination, setPagination] = useState(initialReviews.pagination);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-600 font-medium">
                      {review.userName[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {review.rating}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              {review.title && (
                <h4 className="mt-3 text-sm font-medium text-gray-900">
                  {review.title}
                </h4>
              )}
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>

              {/* Category Ratings */}
              {review.categories && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div>
                    Communication: {review.categories.communication}/5
                  </div>
                  <div>
                    Shipping: {review.categories.shipping}/5
                  </div>
                  <div>
                    Product Quality: {review.categories.productQuality}/5
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="mt-3 flex items-center space-x-4">
                <button
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    // TODO: Implement helpful functionality
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.metadata.helpfulCount})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}
