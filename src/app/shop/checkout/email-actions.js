'use server';

import { sendOrderConfirmationEmail } from '@/lib/email-auth';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import dbConnect from '@/lib/mongodb';

/**
 * Sends order confirmation emails for a list of orders
 * Accepts either order IDs or full order objects with items
 * to prevent redundant database queries
 */
export async function sendOrderConfirmationEmails(ordersData) {
  try {
    // Check if we received order IDs or full order objects
    const isOrderIds = Array.isArray(ordersData) && (ordersData.length === 0 || typeof ordersData[0] === 'string');
    
    let ordersWithItems = [];
    
    // If we received order IDs, we need to fetch the data from the database
    if (isOrderIds) {
      const orderIds = ordersData;
      await dbConnect();
      
      // Find orders with detailed information
      const orders = await Order.find({ _id: { $in: orderIds } });
      if (!orders.length) {
        return { success: false, message: 'No orders found' };
      }

      // Get order items for each order
      const orderItems = await OrderItem.find({ 
        orderId: { $in: orderIds } 
      }).populate('productId');

      // Group items by order
      ordersWithItems = orders.map(order => {
        const items = orderItems.filter(item => 
          item.orderId.toString() === order._id.toString()
        );
        
        return {
          ...order.toObject(),
          items: items
        };
      });
    } else {
      // We already have the full order objects with items
      ordersWithItems = ordersData;
    }

    // Send confirmation email for each order
    const emailResults = await Promise.all(ordersWithItems.map(orderData => 
      sendOrderConfirmationEmail(orderData)
    ));

    // Check if all emails were sent successfully
    const allSuccessful = emailResults.every(result => result.success);
    
    return {
      success: allSuccessful,
      message: allSuccessful 
        ? 'Order confirmation emails sent successfully' 
        : 'Some emails failed to send',
      results: emailResults
    };
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    return {
      success: false, 
      message: 'Failed to send order confirmation emails',
      error: error.message
    };
  }
}
