'use server';

import { getAuthUser } from '@/lib/auth-context';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { Product } from '@/models/Product';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';

export async function getOrders() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { 
        success: false, 
        message: 'Please log in to view your orders' 
      };
    }

    await dbConnect();

    // Find all orders for this user
    const orders = await Order.find({ buyerId: user.$id })
      .sort({ createdAt: -1 })
      .lean();

    // Get all order items for these orders
    const orderItems = await OrderItem.find({
      orderId: { $in: orders.map(order => order._id) }
    })
      .populate({
        path: 'productId',
        model: Product,
        select: 'name description price images status sellerId'
      })
      .lean();

    // Group order items by order ID
    const orderItemsMap = orderItems.reduce((acc, item) => {
      if (!acc[item.orderId.toString()]) {
        acc[item.orderId.toString()] = [];
      }
      acc[item.orderId.toString()].push(item);
      return acc;
    }, {});

    // Transform the orders data
    const transformedOrders = await Promise.all(orders.map(async order => {
      const items = orderItemsMap[order._id.toString()] || [];
      
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = order.tax || 0;
      const shipping = order.shipping || 0;
      const total = subtotal + tax + shipping;
      
      // Transform items to include product details
      const transformedItems = items.map(item => ({
        ...item,
        product: {
          ...item.productId,
          mainImage: (item.productId?.images?.find(img => img.isMain)?.url || 
                    item.productId?.images?.[0]?.url || 
                    '/placeholder-product.jpg')
        }
      }));

      // Transform shipping address
      const shippingAddress = {
        name: order.buyerName,
        phone: order.buyerPhone,
        street: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        pincode: order.shippingPincode
      };

      return {
        ...order,
        items: transformedItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        _id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      };
    }));

    return {
      success: true,
      orders: transformedOrders
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: 'Failed to load orders. Please try again.'
    };
  }
}

export async function getOrderById(orderId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { 
        success: false, 
        message: 'Please log in to view order details' 
      };
    }

    await dbConnect();

    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      buyerId: user.$id
    }).lean();

    if (!order) {
      return {
        success: false,
        message: 'Order not found'
      };
    }

    // Get order items
    const orderItems = await OrderItem.find({ orderId })
      .populate({
        path: 'productId',
        model: Product,
        select: 'name description price images status sellerId'
      })
      .lean();

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = order.tax || 0;
    const shipping = order.shipping || 0;
    const total = subtotal + tax + shipping;

    // Transform shipping address
    const shippingAddress = {
      name: order.buyerName,
      phone: order.buyerPhone,
      street: order.shippingAddress,
      city: order.shippingCity,
      state: order.shippingState,
      pincode: order.shippingPincode
    };

    // Transform the order data
    const transformedItems = orderItems.map(item => ({
      ...item,
      product: {
        ...item.productId,
        mainImage: item.productId.images?.find(img => img.isMain)?.url || 
                  item.productId.images?.[0]?.url || 
                  '/placeholder-product.jpg'
      }
    }));

    return {
      success: true,
      order: {
        ...order,
        _id: order._id.toString(),
        items: transformedItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      message: 'Failed to load order details. Please try again.'
    };
  }
}
