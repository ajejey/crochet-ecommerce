'use client';
import { useState } from 'react';
import { addToCart } from '../../actions';

function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({
        productId: product._id,
        quantity,
      });
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-md border-gray-300 py-2 px-4 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading || product.stockCount === 0}
        className={`w-full py-4 px-8 text-white text-lg font-semibold rounded-lg
          ${
            loading || product.stockCount === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {loading ? 'Adding...' : product.stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default AddToCart;