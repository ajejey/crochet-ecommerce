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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative py-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                <p className="text-red-600 mb-6">Error loading cart items. Please try again later.</p>
                <button
                  onClick={() => router.push('/shop/cart')}
                  className="px-6 py-3 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Return to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
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
        toast.success('Orders created successfully!');
        router.push('/shop/orders');
      } else {
        toast.error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    rows="3"
                    placeholder="Enter your full address"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter 6-digit pincode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="online" disabled>Online Payment (Coming Soon)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-6 py-4 bg-rose-600 text-white rounded-full text-lg font-medium hover:bg-rose-700 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.$id} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-rose-600 font-medium mt-1">
                        ₹{((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-sm text-gray-500">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-rose-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
