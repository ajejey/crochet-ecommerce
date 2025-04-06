'use server';

import { sendOrderConfirmationEmail, sendSellerOrderNotificationEmail } from '@/lib/email-auth';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { info, warning, error } from '@/lib/logger';

/**
 * Sends order confirmation emails for a list of orders
 * Accepts either order IDs or full order objects with items
 * to prevent redundant database queries
 */
export async function sendOrderConfirmationEmails(ordersData) {
  // Log the start of the email sending process
  await info('email', 'Starting order confirmation email process', {
    orderCount: Array.isArray(ordersData) ? ordersData.length : 1,
    isOrderIds: Array.isArray(ordersData) && (ordersData.length === 0 || typeof ordersData[0] === 'string')
  }, {
    orderId: Array.isArray(ordersData) && ordersData.length > 0 ? 
      (typeof ordersData[0] === 'string' ? ordersData[0] : ordersData[0]._id?.toString()) : 
      'unknown'
  });
  
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
    const buyerEmailResults = await Promise.all(ordersWithItems.map(async orderData => {
      console.log('Sending buyer email for order:', orderData._id);
      console.log('Buyer email details:', {
        buyerEmail: orderData.buyerEmail,
        buyerName: orderData.buyerName,
        orderId: orderData._id
      });
      
      // Log buyer email attempt
      await info('email', `Sending buyer confirmation email for order ${orderData._id}`, {
        buyerEmail: orderData.buyerEmail ? orderData.buyerEmail.substring(0, 3) + '***' : 'unknown', // Partial email for privacy
        itemCount: orderData.items?.length || 0,
        orderTotal: orderData.totalAmount || 0
      }, {
        orderId: orderData._id.toString(),
        userId: orderData.buyerId
      });
      
      return sendOrderConfirmationEmail(orderData);
    }));
    
    console.log('Buyer email results:', buyerEmailResults);
    
    // Send notification email to sellers
    const sellerEmailResults = await Promise.all(ordersWithItems.map(async orderData => {
      if (orderData.seller && orderData.seller.email) {
        console.log('Sending seller email for order:', orderData._id);
        console.log('Seller email details:', {
          sellerEmail: orderData.seller.email,
          sellerName: orderData.seller.name,
          orderId: orderData._id
        });
        
        // Log seller email attempt
        await info('email', `Sending seller notification email for order ${orderData._id}`, {
          sellerEmail: orderData.seller.email ? orderData.seller.email.substring(0, 3) + '***' : 'unknown', // Partial email for privacy
          itemCount: orderData.items?.length || 0,
          orderTotal: orderData.totalAmount || 0
        }, {
          orderId: orderData._id.toString(),
          sellerId: orderData.seller.id || orderData.sellerId
        });
        
        return sendSellerOrderNotificationEmail({
          ...orderData,
          sellerEmail: orderData.seller.email,
          sellerName: orderData.seller.name || 'Seller'
        });
      }
      console.log('No seller email found for order:', orderData._id);
      await warning('email', `No seller email found for order ${orderData._id}`, {
        sellerId: orderData.sellerId,
        orderId: orderData._id.toString()
      }, {
        orderId: orderData._id.toString(),
        sellerId: orderData.sellerId
      });
      return { success: false, message: 'Seller email not found' };
    }));
    
    console.log('Seller email results:', sellerEmailResults);

    // Check if all emails were sent successfully
    const allBuyerEmailsSuccessful = buyerEmailResults.every(result => result.success);
    const allSellerEmailsSuccessful = sellerEmailResults.every(result => result.success);
    const allSuccessful = allBuyerEmailsSuccessful && allSellerEmailsSuccessful;
    
    // Log the final result of the email sending process
    if (allSuccessful) {
      await info('email', 'All order confirmation emails sent successfully', {
        orderCount: ordersWithItems.length,
        buyerEmailsSent: buyerEmailResults.length,
        sellerEmailsSent: sellerEmailResults.filter(r => r.success).length
      }, {
        orderId: ordersWithItems.length === 1 ? ordersWithItems[0]._id.toString() : undefined
      });
    } else {
      await warning('email', 'Some order confirmation emails failed to send', {
        orderCount: ordersWithItems.length,
        buyerEmailsSuccess: buyerEmailResults.filter(r => r.success).length,
        buyerEmailsFailed: buyerEmailResults.filter(r => !r.success).length,
        sellerEmailsSuccess: sellerEmailResults.filter(r => r.success).length,
        sellerEmailsFailed: sellerEmailResults.filter(r => !r.success).length
      }, {
        orderId: ordersWithItems.length === 1 ? ordersWithItems[0]._id.toString() : undefined
      });
    }
    
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
    
    // Log the error with the error tracking system
    await error('email', 'Error sending order confirmation emails', error, {
      orderCount: Array.isArray(ordersData) ? ordersData.length : 1,
      orderId: Array.isArray(ordersData) && ordersData.length > 0 ? 
        (typeof ordersData[0] === 'string' ? ordersData[0] : ordersData[0]._id?.toString()) : 
        'unknown'
    });
    
    return {
      success: false, 
      message: 'Failed to send order confirmation emails',
      error: error.message
    };
  }
}

// Helper function to encode Basic Auth token 
function getShipwayAuthToken() {
  const token = Buffer.from(`${process.env.SHIPWAY_USERNAME}:${process.env.SHIPWAY_PASSWORD}`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Create a shipping order in Shipway
 * This function should be called after payment verification and email sending
 * It's designed to be non-blocking and won't affect the user flow if it fails
 * @param {Object} order - The order object from MongoDB
 * @param {Array} orderItems - The order items associated with the order
 */
export async function createShipwayOrder(order, orderItems) {
  // Log the start of the Shipway order creation process
  await info('shipping', `Creating Shipway order for order ${order._id}`, {
    orderTotal: order.totalAmount,
    itemCount: orderItems.length
  }, {
    orderId: order._id.toString(),
    userId: order.buyerId
  });
  
  try {
    // Default weight and dimensions if not available
    const defaultWeight = 250; // 250g
    const defaultDimensions = {
      length: 30,
      width: 25,
      height: 10
    };

    // Extract first and last name from buyer name
    const nameParts = order.buyerName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Calculate total weight - use product specifications if available, otherwise use default
    const totalWeight = orderItems.reduce((total, item) => {
      const weight = item.productId?.specifications?.weight?.value || defaultWeight;
      return total + (weight * item.quantity);
    }, 0);

    // Prepare the Shipway order payload
    const shipwayOrder = {
      order_id: order._id.toString(),
      products: orderItems.map(item => ({
        product: item.productId?.name || 'Crochet Product',
        price: item.price.toString(),
        product_code: item.productId?._id.toString() || item.productId.toString(),
        product_quantity: item.quantity.toString(),
        discount: "0",
        tax_rate: "18",
        tax_title: "GST"
      })),
      discount: "0",
      shipping: order.shipping ? order.shipping.toString() : "0",
      order_total: order.totalAmount.toString(),
      gift_card_amt: "0",
      taxes: ((order.totalAmount * 18) / 100).toString(), // 18% GST
      payment_type: "P", // Prepaid
      email: order.buyerEmail,
      billing_address: order.shippingAddress,
      billing_city: order.shippingCity,
      billing_state: order.shippingState,
      billing_country: "India",
      billing_firstname: firstName,
      billing_lastname: lastName,
      billing_phone: order.buyerPhone,
      billing_zipcode: order.shippingPincode,
      shipping_address: order.shippingAddress,
      shipping_city: order.shippingCity,
      shipping_state: order.shippingState,
      shipping_country: "India",
      shipping_firstname: firstName,
      shipping_lastname: lastName,
      shipping_phone: order.buyerPhone,
      shipping_zipcode: order.shippingPincode,
      order_weight: totalWeight.toString(),
      box_length: defaultDimensions.length.toString(),
      box_breadth: defaultDimensions.width.toString(),
      box_height: defaultDimensions.height.toString(),
      order_date: order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Log the Shipway order payload (without sensitive information)
    await info('shipping', `Shipway payload prepared for order ${order._id}`, {
      orderId: order._id.toString(),
      orderTotal: shipwayOrder.order_total,
      productCount: shipwayOrder.products.length,
      weight: shipwayOrder.order_weight
    }, {
      orderId: order._id.toString(),
      userId: order.buyerId
    });

    const response = await fetch('https://app.shipway.com/api/v2orders', {
      method: 'POST',
      headers: {
        'Authorization': getShipwayAuthToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shipwayOrder)
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Log the error with the error tracking system
      await error('shipping', `Shipway API error for order ${order._id}`, {
        statusCode: response.status,
        errorText,
        orderId: order._id.toString()
      }, {
        orderId: order._id.toString(),
        userId: order.buyerId
      });
      
      return {
        success: false,
        message: `Failed to create shipping order: ${errorText}`,
        orderId: order._id.toString()
      };
    }

    const result = await response.json();
    
    // Log successful creation
    await info('shipping', `Shipway order created successfully for order ${order._id}`, {
      shipwayOrderId: result.order_id || 'Unknown',
      shipwayStatus: result.status || 'Unknown',
      orderId: order._id.toString()
    }, {
      orderId: order._id.toString(),
      userId: order.buyerId
    });
    
    return {
      success: true,
      message: 'Shipping order created successfully',
      shipwayResponse: result,
      orderId: order._id.toString()
    };
  } catch (error) {
    // Log the error with the error tracking system
    await error('shipping', `Exception creating Shipway order for ${order._id}`, error, {
      orderId: order._id.toString(),
      userId: order.buyerId
    });
    
    return {
      success: false,
      message: `Error creating shipping order: ${error.message}`,
      error: error.toString(),
      orderId: order._id.toString()
    };
  }
}
