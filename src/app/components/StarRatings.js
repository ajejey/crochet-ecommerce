import React from 'react'

const StarRatings = ({ rating }) => {
    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const isFullStar = starValue <= rating;
                const isHalfStar = starValue - 0.5 <= rating && starValue > rating;

                return (
                    <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFullStar ? 'gold' : isHalfStar ? 'url(#half)' : 'none'}
                        stroke="currentColor"
                        className={`w-5 h-5 ${isFullStar || isHalfStar ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                        {isHalfStar && (
                            <defs>
                                <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                                    <stop offset="50%" stopColor="gold" />
                                    <stop offset="50%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        )}
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                    </svg>
                );
            })}
            <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
        </div>
    )
}

export default StarRatings