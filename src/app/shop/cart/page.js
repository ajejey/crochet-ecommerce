'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import Link from 'next/link';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, isLoading } = useCart();
  const { isMobile, isTablet } = useBreakpoint();
  
  console.log("Cart:", cart);

  const handleQuantityChange = async (productId, newQuantity) => {
    const result = await updateQuantity(productId, newQuantity);
    if (!result.success) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId);
    if (!result.success) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-center text-gray-500">Loading cart...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some items to your cart to see them here.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 lg:pb-0"> {/* Added padding bottom for mobile sticky button */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item._id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 relative">
                        <Image
                          src={item.image_urls[0].url}
                          alt={item.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link href={`/shop/product/${item._id}`} className="hover:text-rose-600">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4 text-lg font-medium text-gray-900">
                              ₹{(item.salePrice || item.price) * item.quantity}
                            </p>
                          </div>
                          {item.salePrice && (
                            <p className="mt-1 text-sm text-gray-500 line-through">
                              ₹{item.price * item.quantity}
                            </p>
                          )}
                        </div>
                        <div className="flex-1 flex items-end justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`p-1 rounded-full ${
                                item.quantity <= 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-gray-900 text-lg font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (item.inventory?.stockCount || 0)}
                              className={`p-1 rounded-full ${
                                item.quantity >= (item.inventory?.stockCount || 0)
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="text-gray-500 hover:text-rose-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Desktop */}
          <div className={`w-full lg:w-96 ${isMobile || isTablet ? 'hidden' : 'block'}`}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">₹{cart.totalAmount}</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">
                      {cart.totalAmount >= 1000 ? 'Free' : '₹100'}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      ₹{cart.totalAmount + (cart.totalAmount >= 1000 ? 0 : 100)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/shop/checkout')}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-rose-600 hover:bg-rose-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary - Mobile (visible but not sticky) */}
          <div className={`w-full ${isMobile || isTablet ? 'block' : 'hidden'} mb-6`}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">₹{cart.totalAmount}</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">
                      {cart.totalAmount >= 1000 ? 'Free' : '₹100'}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      ₹{cart.totalAmount + (cart.totalAmount >= 1000 ? 0 : 100)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Checkout Button for Mobile */}
      <div className={`fixed bottom-0 left-0 right-0 ${!isMobile && !isTablet ? 'hidden' : ''} bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 pb-8 z-50`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium text-gray-900">Total:</span>
          <span className="text-base font-medium text-gray-900">
            ₹{cart.totalAmount + (cart.totalAmount >= 1000 ? 0 : 100)}
          </span>
        </div>
        <button
          onClick={() => router.push('/shop/checkout')}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-rose-600 hover:bg-rose-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
