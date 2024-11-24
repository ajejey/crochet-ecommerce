import { getProductsByCategory } from '../../../actions';
import ProductCard from '../../../components/ProductCard';

export default async function RelatedProducts({ category, currentProductId }) {
  const products = await getProductsByCategory(category);
  const relatedProducts = products
    .filter(product => product.$id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>
    </section>
  );
}
