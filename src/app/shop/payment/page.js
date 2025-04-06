'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getOrderDetails, createRazorpayOrder, verifyRazorpayPayment } from '../checkout/actions';
import { sendOrderConfirmationEmails, createShipwayOrder } from '../checkout/email-actions';
import { useCart } from '@/app/components/CartProvider';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { isMobile, isTablet } = useBreakpoint();
  
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, sending_email, success, failed
  const [error, setError] = useState(null);

  useEffect(() => {
    const orderIds = searchParams.get('orderIds')?.split(',') || [];
    if (!orderIds.length) {
      toast.error('No orders found paymentPage useEffect');
      console.log("No orders found ", orderIds);
      router.push('/shop/cart');
      return;
    }

    const loadOrderDetails = async () => {
      setIsLoading(true);
      try {
        const result = await getOrderDetails(orderIds);
        if (result.success) {
          setOrders(result.orders);
          // Create Razorpay order
          const razorpayResult = await createRazorpayOrder(orderIds);
          if (razorpayResult.success) {
            setPaymentData(razorpayResult);
          } else {
            setError(razorpayResult.message);
            toast.error(razorpayResult.message);
          }
        } else {
          setError(result.message);
          toast.error(result.message);
          console.log("Order details not found ", result);
          router.push('/shop/cart');
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        setError('Failed to load order details. Please try again.');
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [searchParams, router, toast]);

  const handlePayment = () => {
    if (!paymentData) return;
    
    setPaymentStatus('processing');
    
    const options = {
      key: paymentData.key,
      amount: paymentData.amount * 100, // Amount in paise
      currency: paymentData.currency,
      name: 'Knitkart.in',
      description: 'Handmade Crochet Products',
      order_id: paymentData.orderId,
      handler: async (response) => {
        try {
          setPaymentStatus('processing');
          const verificationResult = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          if (verificationResult.success) {
            // Payment verification successful, now send confirmation emails
            setPaymentStatus('sending_email');
            toast.info('Payment successful! Sending order confirmation...');
            
            // Clear cart immediately after payment verification
            clearCart();
            
            // Pass the full order objects with items to avoid redundant database queries
            console.log('Sending confirmation emails for orders:', verificationResult.orders);
            try {
              const emailResult = await sendOrderConfirmationEmails(verificationResult.orders);
              
              console.log('Email sending result:', emailResult);
              
              if (emailResult.success) {
                toast.success('Order confirmation emails sent successfully!');
              } else {
                // Even if email sending fails, the order was still successful
                toast.error('Order placed successfully, but confirmation email could not be sent.');
                console.error('Email sending error:', emailResult.message);
                console.error('Email sending details:', emailResult);
              }
              
              // Create Shipway shipping orders (non-blocking)
              // This runs after email confirmation but doesn't block the user flow
              verificationResult.orders.forEach(order => {
                // Process each order separately to avoid one failure affecting others
                createShipwayOrder(order, order.items)
                  .then(shipwayResult => {
                    if (shipwayResult.success) {
                      console.log(`Shipway order created for order ${order._id}:`, shipwayResult);
                    } else {
                      console.error(`Failed to create Shipway order for order ${order._id}:`, shipwayResult.message);
                    }
                  })
                  .catch(error => {
                    // Log error but don't affect user flow
                    console.error(`Error creating Shipway order for order ${order._id}:`, error);
                  });
              });
            } catch (emailError) {
              console.error('Exception during email sending:', emailError);
              toast.error('Order placed successfully, but there was an error sending confirmation emails.');
            }
            
            setPaymentStatus('success');
            
            // Redirect to order confirmation page after a delay
            setTimeout(() => {
              router.push(`/shop/orders?success=true`);
            }, 2000);
          } else {
            setPaymentStatus('failed');
            toast.error(verificationResult.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setPaymentStatus('failed');
          toast.error('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: orders[0]?.buyerName || '',
        email: orders[0]?.buyerEmail || '',
        contact: orders[0]?.buyerPhone || '',
      },
      theme: {
        color: '#E11D48', // rose-600
      },
      modal: {
        ondismiss: function() {
          setPaymentStatus('pending');
          toast.info('Payment cancelled. You can try again.');
        }
      }
    };

    // Create and open Razorpay payment form
    const razorpayPayment = new window.Razorpay(options);
    razorpayPayment.open();
  };

  // Calculate order totals
  const subtotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const shipping = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-8 pb-24 lg:pb-0">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-8">Payment</h1> */}
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-rose-200 mb-4"></div>
                <div className="h-4 w-48 bg-rose-200 mb-2 rounded"></div>
                <div className="h-3 w-32 bg-rose-200 rounded"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading payment details...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={() => router.push('/shop/cart')}
                  className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  Return to Cart
                </button>
              </div>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <svg className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                <button 
                  onClick={() => router.push('/shop/orders')}
                  className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>
          ) : paymentStatus === 'sending_email' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sending Order Confirmation...</h2>
                <p className="text-gray-600 mb-6">We're sending your order details to your email. Please wait...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="divide-y divide-gray-200">
                  {orders.map((order, orderIndex) => (
                    <div key={order._id} className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Order #{orderIndex + 1}</h3>
                      
                      {order.items?.map((item) => {
                        const isMadeToOrder = item.isMadeToOrder;
                        return (
                          <div key={item._id} className="flex justify-between py-2">
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-gray-900">{item.productId?.name || 'Product'}</h4>
                              <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                              {isMadeToOrder && (
                                <div className="mt-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md inline-flex items-center">
                                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                                  Made to order ({item.madeToOrderDays || 7} days)
                                  {item.estimatedDeliveryDate && (
                                    <span className="ml-1 text-xs text-gray-500">
                                      • Est. delivery: {new Date(item.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="ml-4 text-base font-medium text-gray-900">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        );
                      })}
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Shipping to: {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="py-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>₹{subtotal}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                      <p>Shipping</p>
                      <p>{shipping === 0 ? 'Free' : `₹${shipping}`}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                      <p>Total</p>
                      <p>₹{total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Made to Order Notice */}
              {orders.some(order => order.items?.some(item => item.isMadeToOrder)) && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold text-amber-800 mb-2">Made-to-Order Items</h2>
                  <p className="text-gray-600 mb-2">
                    Your order contains items that will be made to order. These items will be crafted specially for you and may take additional time to deliver.
                  </p>
                  
                  {/* List of made-to-order items with their estimated delivery dates */}
                  <div className="mt-3 mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Estimated Delivery Timeline:</h3>
                    <ul className="space-y-2">
                      {orders.flatMap(order => 
                        order.items
                          .filter(item => item.isMadeToOrder)
                          .map(item => {
                            const estimatedDate = item.estimatedDeliveryDate 
                              ? new Date(item.estimatedDeliveryDate) 
                              : new Date(Date.now() + ((item.madeToOrderDays || 7) * 24 * 60 * 60 * 1000));
                            
                            return (
                              <li key={item._id} className="flex items-start">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                                <div>
                                  <span className="font-medium">{item.productId?.name || 'Product'}</span>
                                  <span className="text-gray-600"> - Estimated delivery by {estimatedDate.toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric'
                                  })}</span>
                                </div>
                              </li>
                            );
                          })
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm text-amber-700">
                    <p>Standard items will be shipped immediately, while made-to-order items will be shipped once they are ready. You'll receive email updates about your order status.</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <p className="text-gray-600 mb-4">
                  We accept credit/debit cards, UPI, and other payment methods through our secure payment gateway.
                </p>
                
                {/* Desktop Payment Button */}
                <div className={`mt-6 ${isMobile || isTablet ? 'hidden' : 'block'}`}>
                  <button
                    onClick={handlePayment}
                    disabled={paymentStatus === 'processing' || !paymentData}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      paymentStatus === 'processing' || !paymentData
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {paymentStatus === 'processing' ? 'Processing...' : `Make Payment ₹${total}`}
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-center">
                  <button 
                    onClick={() => router.push('/shop/cart')}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                  >
                    Return to Cart
                  </button>
                </div>
              </div>
              
              {/* Sticky Payment Button for Mobile */}
              {(isMobile || isTablet) && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 pb-8 z-50">
                  {orders.some(order => order.items?.some(item => item.isMadeToOrder)) && (
                    <div className="mb-2 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                      <span className="text-xs text-amber-700">Some items will be made to order</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-medium text-gray-900">Total:</span>
                    <span className="text-base font-medium text-gray-900">₹{total}</span>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={paymentStatus === 'processing' || !paymentData}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      paymentStatus === 'processing' || !paymentData
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {paymentStatus === 'processing' ? 'Processing...' : `Make Payment ₹${total}`}
                  </button>
                </div>
                
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
