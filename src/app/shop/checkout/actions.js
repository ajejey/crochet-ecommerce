'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth-context';

const ORDERS_COLLECTION = 'orders';
const ORDER_ITEMS_COLLECTION = 'order_items';
const CART_ITEMS_COLLECTION = 'cart_items';

export async function createOrder(orderData) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to complete your purchase' };
    }

    const cartId = cookies().get('cartId')?.value;
    if (!cartId) {
      return { success: false, message: 'No cart found' };
    }

    // Get cart items
    const cartItems = await CartItem.find({ cartId })
      .populate({
        path: 'product',
        model: Product
      })
      .populate('variant');

    if (!cartItems.length) {
      return { success: false, message: 'Cart is empty' };
    }

    // Get the first product to get seller information
    const firstProduct = cartItems[0].product;

    // Calculate fees and amounts
    const platformFeePercentage = 0.10; // 10% platform fee
    const platformFee = orderData.total * platformFeePercentage;
    const sellerAmount = orderData.total - platformFee;

    // Create the order document
    const order = await Order.create({
      buyerId: user.$id,
      buyerEmail: user.email,
      buyerName: orderData.name,
      buyerPhone: orderData.phone,
      sellerId: firstProduct.sellerId,
      totalAmount: orderData.total,
      platformFee: platformFee,
      sellerAmount: sellerAmount,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: '',
      razorpayPaymentId: '',
      shippingAddress: orderData.address,
      shippingCity: orderData.city,
      shippingState: orderData.state,
      shippingPincode: orderData.pincode
    });

    // Create order items
    const orderItems = await Promise.all(cartItems.map(async (item) => {
      return OrderItem.create({
        orderId: order._id,
        productId: item.product._id,
        variantId: item.variant?._id || null,
        quantity: item.quantity,
        price: item.variant ? item.variant.price : item.product.price
      });
    }));

    // Clear cart items
    await CartItem.deleteMany({ cartId });

    return {
      success: true,
      message: 'Order created successfully',
      order: {
        ...order.toObject(),
        items: orderItems.map(item => item.toObject())
      }
    };

  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: 'Failed to create order. Please try again.'
    };
  }
}
