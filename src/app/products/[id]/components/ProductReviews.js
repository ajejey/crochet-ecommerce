function ProductReviews({ productId }) {
    // Fetch reviews from your database
    // const reviews = await getProductReviews(productId);
    const reviews = [
        {
            _id: 1,
            rating: 5,
            createdAt: '2021-01-01T00:00:00.000Z',
            title: 'Review 1',
            content: 'I really enjoyed using this product.',
        }
    ]
  
    return (
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="mt-6 space-y-8">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-4 text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <h3 className="font-medium text-gray-900">{review.title}</h3>
              <p className="mt-2 text-gray-600">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  export default ProductReviews