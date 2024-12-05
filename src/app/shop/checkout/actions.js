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

    // Group items by seller
    const itemsBySeller = cartItems.reduce((acc, item) => {
      const sellerId = item.product.sellerId;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {});

    const orders = [];
    const orderItems = [];

    // Create orders for each seller
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      // Calculate total for this seller's items
      const sellerTotal = items.reduce((sum, item) => {
        const itemPrice = (item.variant ? item.variant.price : item.product.price) * item.quantity;
        return sum + itemPrice;
      }, 0);

      // Calculate fees and amounts for this seller
      const platformFeePercentage = 0.10; // 10% platform fee
      const platformFee = sellerTotal * platformFeePercentage;
      const sellerAmount = sellerTotal - platformFee;

      // Create order for this seller
      const order = await Order.create({
        buyerId: user.$id,
        buyerEmail: user.email,
        buyerName: orderData.name,
        buyerPhone: orderData.phone,
        sellerId: sellerId,
        totalAmount: sellerTotal,
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

      orders.push(order);

      // Create order items for this seller's order
      const sellerOrderItems = await Promise.all(items.map(async (item) => {
        return OrderItem.create({
          orderId: order._id,
          productId: item.product._id,
          variantId: item.variant?._id || null,
          quantity: item.quantity,
          price: item.variant ? item.variant.price : item.product.price
        });
      }));

      orderItems.push(...sellerOrderItems);
    }

    // Clear cart items
    await CartItem.deleteMany({ cartId });

    return {
      success: true,
      message: 'Orders created successfully',
      orders: orders.map(order => ({
        ...order.toObject(),
        items: orderItems
          .filter(item => item.orderId.toString() === order._id.toString())
          .map(item => item.toObject())
      }))
    };

  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: 'Failed to create order. Please try again.'
    };
  }
}
