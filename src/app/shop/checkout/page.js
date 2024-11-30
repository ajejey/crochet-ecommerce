'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useCart } from '@/app/components/CartProvider';
import { createOrder } from './actions';
import { getCartItems } from '../actions/cart';

// Use server action directly
const fetcher = async () => {
  const result = await getCartItems();
  if (!result.success) {
    throw new Error('Failed to load cart items');
  }
  return result.items || [];
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartItems = [], error, isLoading } = useSWR('cart-items', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    errorRetryCount: 3
  });
  
  const { refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod' // cash on delivery by default
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && (!cartItems || cartItems.length === 0)) {
      toast.error('Your cart is empty');
      router.push('/shop/cart');
    }
  }, [cartItems, isLoading, router]);

  // Redirect to cart if no items or error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = (item.product?.price || 0) + (item.variant?.price_adjustment || 0);
      return sum + itemPrice * (item.quantity || 0);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Calculate total
      const total = calculateTotal();

      const orderData = {
        ...formData,
        total,
        items: cartItems.map(item => ({
          productId: item.product._id,
          variantId: item.variant?._id,
          quantity: item.quantity,
          price: (item.variant?.price || item.product.price)
        })),
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      const result = await createOrder(orderData);

      if (result.success) {
        await refreshCart();
        toast.success('Order placed successfully!');
        router.push('/shop/orders');
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600 mb-4">Error loading cart items. Please try again later.</p>
          <button
            onClick={() => router.push('/shop/cart')}
            className="text-purple-600 hover:text-purple-700"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                rows="3"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                pattern="[0-9]{6}"
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online" disabled>Online Payment (Coming Soon)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.$id} className="flex gap-4 py-2 border-b">
                <div className="relative w-20 h-20">
                  <img
                    src={item.product.image_urls?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium">
                    ${((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
