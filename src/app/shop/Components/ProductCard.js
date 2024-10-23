import StarRatings from "@/app/components/StarRatings";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  console.log("product", product)
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link href={`/product/${product._id}`}>
        <div className="relative pb-[100%]">
          <Image
            src={product.images.length && product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 
                transition-transform duration-300"
            layout="fill"
            objectFit="cover"
          />
          {/* {product.tags?.map((tag) => (
              <span
                key={tag}
                className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 
                  rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))} */}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {/* Star Rating */}
            {product.rating > 0 ? (
              <StarRatings rating={product.rating} />
            ) : (
              <span className="text-sm text-gray-600 italic">No ratings yet</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description?.length > 120
              ? `${product.description.slice(0, 117)}...`
              : product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900"> ₹{product.price}</span>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
                transition-colors text-sm font-medium">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}