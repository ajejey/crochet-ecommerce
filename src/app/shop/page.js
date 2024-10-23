export const dynamic = 'auto';
export const revalidate = 3600; // revalidate every hour
import { getProducts } from './actions';
import FilterSection from './Components/FilterSection';
import ProductGrid from './Components/ProductGrid';

// Generate static params for categories
export async function generateStaticParams() {
  return [
    { category: 'all' },
    { category: 'blankets' },
    { category: 'scarves' },
    { category: 'hats' },
  ];
}


export default async function ShopPage() {
    // Fetch initial products server-side
    const initialProducts = await getProducts();
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">
              Handcrafted Crochet Creations
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-center text-gray-500">
              Each piece is lovingly made with premium materials and attention to detail
            </p>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FilterSection />
          <ProductGrid initialProducts={initialProducts} />
        </div>
      </div>
    );
  }

// export default function ShopPage() {
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [sortBy, setSortBy] = useState('featured');
//     const [searchQuery, setSearchQuery] = useState('');

//     // Filter products based on category and search
//     const filteredProducts = products.filter(product => {
//         const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//         const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
//         return matchesCategory && matchesSearch;
//     });

//     // Sort products
//     const sortedProducts = [...filteredProducts].sort((a, b) => {
//         switch (sortBy) {
//             case 'price-low':
//                 return a.price - b.price;
//             case 'price-high':
//                 return b.price - a.price;
//             case 'rating':
//                 return b.rating - a.rating;
//             default:
//                 return 0;
//         }
//     });

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Hero Section */}
//             <div className="bg-white">
//                 <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
//                     <h1 className="text-4xl font-extrabold text-gray-900 text-center">
//                         Handcrafted Crochet Creations
//                     </h1>
//                     <p className="mt-4 max-w-2xl mx-auto text-center text-gray-500">
//                         Each piece is lovingly made with premium materials and attention to detail
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 {/* Filters and Search */}
//                 <FilterSection  />

//                 {/* Product Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     {sortedProducts.map((product) => (
//                         <div
//                             key={product.id}
//                             className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow 
//                 overflow-hidden group"
//                         >
//                             <Link href={`/product/${product.id}`} className="block">
//                                 <div className="relative pb-[100%]">
//                                     {/* Product Image */}
//                                     <img
//                                         src={product.image}
//                                         alt={product.name}
//                                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 
//                       transition-transform duration-300"
//                                     />
//                                     {/* Tags */}
//                                     <div className="absolute top-2 left-2 flex gap-2">
//                                         {product.tags.map((tag) => (
//                                             <span
//                                                 key={tag}
//                                                 className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium"
//                                             >
//                                                 {tag}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Product Info */}
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-medium text-gray-900 mb-1">
//                                         {product.name}
//                                     </h3>
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <div className="flex items-center">
//                                             {[...Array(5)].map((_, i) => (
//                                                 <svg
//                                                     key={i}
//                                                     className={`w-4 h-4 ${i < Math.floor(product.rating)
//                                                             ? 'text-yellow-400'
//                                                             : 'text-gray-300'
//                                                         }`}
//                                                     fill="currentColor"
//                                                     viewBox="0 0 20 20"
//                                                 >
//                                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                                 </svg>
//                                             ))}
//                                         </div>
//                                         <span className="text-sm text-gray-600">
//                                             ({product.reviews})
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-xl font-bold text-gray-900">
//                                             ${product.price}
//                                         </span>
//                                         <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
//                       transition-colors text-sm font-medium">
//                                             Add to Cart
//                                         </button>
//                                     </div>
//                                 </div>
//                             </Link>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Empty State */}
//                 {sortedProducts.length === 0 && (
//                     <div className="text-center py-12">
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">
//                             No products found
//                         </h3>
//                         <p className="text-gray-500">
//                             Try adjusting your search or filter criteria
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }