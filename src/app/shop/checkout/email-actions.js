'use server';

import { sendOrderConfirmationEmail, sendSellerOrderNotificationEmail } from '@/lib/email-auth';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';

/**
 * Sends order confirmation emails for a list of orders
 * Accepts either order IDs or full order objects with items
 * to prevent redundant database queries
 */
export async function sendOrderConfirmationEmails(ordersData) {

  console.log('Sending order confirmation emails for:', ordersData);
  
  try {
    // Check if we received order IDs or full order objects
    const isOrderIds = Array.isArray(ordersData) && (ordersData.length === 0 || typeof ordersData[0] === 'string');
    
    let ordersWithItems = [];
    
    if (Array.isArray(ordersData) && ordersData.every(item => typeof item === 'string')) {
      // If ordersData is an array of strings (order IDs)
      const orderIds = ordersData;
      await dbConnect();
      
      console.log('Sending confirmation emails for order IDs:', orderIds);
      
      // Find orders with detailed information
      const orders = await Order.find({ _id: { $in: orderIds } });
      console.log('Found orders for email confirmation:', orders.length);
      
      if (!orders.length) {
        return { success: false, message: 'No orders found for email confirmation' };
      }

      // Get order items for each order
      const orderItems = await OrderItem.find({ 
        orderId: { $in: orderIds } 
      }).populate('productId')
      
      // Get all unique seller IDs from the orders
      const sellerIds = [...new Set(orders.map(order => order.sellerId))];
      console.log('Seller IDs for email notifications:', sellerIds);
      
      // Fetch seller information for all sellers
      const sellers = await User.find({
        appwriteId: { $in: sellerIds }
      }).select('appwriteId email name');
      
      console.log('Found sellers:', sellers.length);

      // Group items by order and add seller information
      ordersWithItems = orders.map(order => {
        const items = orderItems.filter(item => 
          item.orderId.toString() === order._id.toString()
        );
        
        // Find seller for this order
        const seller = sellers.find(s => s.appwriteId === order.sellerId);
        
        return {
          ...order.toObject(),
          items: items,
          seller: seller ? {
            id: seller.appwriteId,
            email: seller.email,
            name: seller.name
          } : null
        };
      });
    } else {
      // We already have the full order objects with items
      console.log('Using provided order objects for email confirmation');
      
      // Make sure we have database connection for any additional queries
      await dbConnect();
      
      // Ensure we have seller information for each order
      if (Array.isArray(ordersData)) {
        // Get all unique seller IDs from the orders
        const sellerIds = [...new Set(ordersData.map(order => order.sellerId))];
        console.log('Seller IDs for email notifications (from provided orders):', sellerIds);
        
        if (sellerIds.length > 0) {
          // Fetch seller information for all sellers
          const sellers = await User.find({
            appwriteId: { $in: sellerIds }
          }).select('appwriteId email name');
          
          console.log('Found sellers for provided orders:', sellers.length);
          
          // Add seller information to each order
          ordersWithItems = ordersData.map(order => {
            // Find seller for this order
            const seller = sellers.find(s => s.appwriteId === order.sellerId);
            
            // Only add seller info if not already present
            if (!order.seller && seller) {
              return {
                ...order,
                seller: {
                  id: seller.appwriteId,
                  email: seller.email,
                  name: seller.name
                }
              };
            }
            
            return order;
          });
        } else {
          console.log('No seller IDs found in provided orders');
          ordersWithItems = ordersData;
        }
      } else {
        console.log('Provided orders data is not an array:', typeof ordersData);
        ordersWithItems = Array.isArray(ordersData) ? ordersData : [ordersData];
      }
    }

    console.log('Orders with items:', ordersWithItems);

    console.log('Preparing to send emails for', ordersWithItems.length, 'orders');
    
    // Send confirmation email to buyer for each order
    const buyerEmailResults = await Promise.all(ordersWithItems.map(orderData => {
      console.log('Sending buyer email for order:', orderData._id);
      console.log('Buyer email details:', {
        buyerEmail: orderData.buyerEmail,
        buyerName: orderData.buyerName,
        orderId: orderData._id
      });
      
      return sendOrderConfirmationEmail(orderData);
    }));
    
    console.log('Buyer email results:', buyerEmailResults);
    
    // Send notification email to sellers
    const sellerEmailResults = await Promise.all(ordersWithItems.map(orderData => {
      if (orderData.seller && orderData.seller.email) {
        console.log('Sending seller email for order:', orderData._id);
        console.log('Seller email details:', {
          sellerEmail: orderData.seller.email,
          sellerName: orderData.seller.name,
          orderId: orderData._id
        });
        
        return sendSellerOrderNotificationEmail({
          ...orderData,
          sellerEmail: orderData.seller.email,
          sellerName: orderData.seller.name || 'Seller'
        });
      }
      console.log('No seller email found for order:', orderData._id);
      return { success: false, message: 'Seller email not found' };
    }));
    
    console.log('Seller email results:', sellerEmailResults);

    // Check if all emails were sent successfully
    const allBuyerEmailsSuccessful = buyerEmailResults.every(result => result.success);
    const allSellerEmailsSuccessful = sellerEmailResults.every(result => result.success);
    const allSuccessful = allBuyerEmailsSuccessful && allSellerEmailsSuccessful;
    
    return {
      success: allSuccessful,
      message: allSuccessful 
        ? 'All order emails sent successfully' 
        : 'Some emails failed to send',
      buyerResults: buyerEmailResults,
      sellerResults: sellerEmailResults
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
