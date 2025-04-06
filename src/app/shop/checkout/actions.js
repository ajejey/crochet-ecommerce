'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { getAuthUser } from '@/lib/auth-context';
import { User } from '@/models/User';

const ORDERS_COLLECTION = 'orders';
const ORDER_ITEMS_COLLECTION = 'order_items';
const CART_ITEMS_COLLECTION = 'cart_items';

// update shipping details in User document in MongoDB not in Order. Order is also updated but later
export async function updateUserDetails(orderData) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to update user details' };
    }

    const addressData = {
      address: orderData.shippingAddress,
      city: orderData.shippingCity,
      state: orderData.shippingState,
      pincode: orderData.shippingPincode
    };

    // First, get the current user to check existing addresses
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return { success: false, message: 'User not found' };
    }
    
    // Check if this address already exists (normalized comparison)
    const addressExists = currentUser.addresses.some(addr => {
      return (
        addr.address?.trim().toLowerCase() === addressData.address?.trim().toLowerCase() &&
        addr.city?.trim().toLowerCase() === addressData.city?.trim().toLowerCase() &&
        addr.state?.trim().toLowerCase() === addressData.state?.trim().toLowerCase() &&
        addr.pincode?.trim() === addressData.pincode?.trim()
      );
    });

    // Update operations to perform
    const updateOps = {
      $set: {
        name: orderData.buyerName,
        phone: orderData.buyerPhone,
        email: orderData.buyerEmail,
      }
    };
    
    // Only add the address if it doesn't already exist
    if (!addressExists) {
      updateOps.$push = { addresses: addressData };
    }

    // Update user details
    await User.updateOne(
      { _id: user._id },
      updateOps
    );

    return { success: true, message: 'User details updated successfully' };
  } catch (error) {
    console.error('Error updating user details:', error);
    return { success: false, message: 'Failed to update user details' };
  }
}

// get user details to autofill the checkout page on load if data available
export async function getUserDetails() {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to get user details' };
    }

    console.log('User in getUserDetails:', user._id);

    const userDetails = await User.findById(user._id);
    if (!userDetails) {
      return { success: false, message: 'User details not found' };
    }

    console.log('User details:', userDetails);

    return { success: true, userDetails: JSON.parse(JSON.stringify(userDetails)) };
  } catch (error) {
    console.error('Error getting user details:', error);
    return { success: false, message: 'Failed to retrieve user details' };
  }
}

export async function createOrder(orderData) {
  try {
    await dbConnect();
    
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const user = await getAuthUser();
    console.log('User authentication result:', user ? 'User authenticated' : 'No user found');
    
    if (!user) {
      console.error('Authentication failed: No user found');
      return { success: false, message: 'Please login to create order' };
    }
    
    console.log('Authenticated user ID:', user._id, 'Appwrite ID:', user.$id);

    // Group items by seller
    if (!orderData.items || !Array.isArray(orderData.items)) {
      console.error('Invalid cart items:', orderData.items);
      return { success: false, message: 'Invalid cart items' };
    }
    
    // Check if all items have sellerId
    const missingSellerItems = orderData.items.filter(item => !item.sellerId);
    if (missingSellerItems.length > 0) {
      console.error('Items missing sellerId:', missingSellerItems);
      return { success: false, message: 'Some items are missing seller information' };
    }
    
    const itemsBySeller = orderData.items.reduce((acc, item) => {
      const sellerId = item.sellerId;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {});
    
    console.log('Items grouped by seller:', Object.keys(itemsBySeller).length, 'sellers');

    const orders = [];
    const orderItems = [];

    // Check inventory for made-to-order items
    const inventoryCheck = await checkInventoryAvailability(orderData.items);
    if (!inventoryCheck.success || !inventoryCheck.isAvailable) {
      return { success: false, message: 'Some items are no longer available' };
    }

    // Create orders for each seller
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      console.log(`Creating order for seller ${sellerId} with ${items.length} items`);
      
      // Calculate total for this seller's items
      const sellerTotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      // Calculate fees and amounts for this seller
      const platformFeePercentage = 0.10; // 10% platform fee
      const platformFee = sellerTotal * platformFeePercentage;
      const sellerAmount = sellerTotal - platformFee;
      
      console.log('Order financial details:', {
        sellerTotal,
        platformFee,
        sellerAmount
      });

      // Create order for this seller
      // Use appwriteId as buyerId if _id is not available
      // const buyerId = user._id ? user._id.toString() : user.$id;
      const buyerId = user.$id;
      
      if (!buyerId) {
        console.error('No valid user ID found:', user);
        throw new Error('User ID not found');
      }
      
      const orderDetails = {
        buyerId: buyerId,
        buyerEmail: orderData.buyerEmail,
        buyerName: orderData.buyerName,
        buyerPhone: orderData.buyerPhone,
        sellerId: sellerId,
        totalAmount: sellerTotal,
        platformFee: platformFee,
        sellerAmount: sellerAmount,
        status: 'pending',
        paymentStatus: 'pending',
        razorpayOrderId: '',
        razorpayPaymentId: '',
        shippingAddress: orderData.shippingAddress,
        shippingCity: orderData.shippingCity,
        shippingState: orderData.shippingState,
        shippingPincode: orderData.shippingPincode,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating order with data:', orderDetails);
      const order = await Order.create(orderDetails);

      orders.push(order);

      // Create order items and update inventory
      for (const item of items) {
        // Get inventory information for this item
        const itemInventoryInfo = inventoryCheck.items.find(i => i.productId === item._id);
        const isMadeToOrder = itemInventoryInfo?.isMadeToOrder || false;
        const madeToOrderDays = itemInventoryInfo?.madeToOrderDays || 7;
        const madeToOrderQuantity = itemInventoryInfo?.madeToOrderQuantity || 0;
        
        // Calculate estimated delivery date
        const estimatedDeliveryDate = isMadeToOrder ? 
          new Date(Date.now() + (madeToOrderDays * 24 * 60 * 60 * 1000)) : 
          new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)); // 3 days for regular items
        
        // Set production status based on whether it's made to order
        const productionStatus = isMadeToOrder ? 'pending' : 'completed';
        
        // Create the order item
        const orderItem = await OrderItem.create({
          orderId: order._id,
          productId: new mongoose.Types.ObjectId(item._id),
          variantId: item.variantId ? new mongoose.Types.ObjectId(item.variantId) : undefined,
          quantity: item.quantity,
          price: item.price,
          isMadeToOrder: isMadeToOrder,
          madeToOrderDays: madeToOrderDays,
          estimatedDeliveryDate: estimatedDeliveryDate,
          productionStatus: productionStatus
        });
        orderItems.push(orderItem);
        
        // Update product inventory
        // For made-to-order items, we only reduce the stock by what's available
        // The rest will be made to order
        const product = await Product.findById(item._id);
        if (product) {
          const currentStock = product.inventory.stockCount;
          const stockToReduce = isMadeToOrder ? 
            Math.min(currentStock, item.quantity) : // Only reduce available stock for made-to-order
            item.quantity; // Reduce full quantity for regular items
          
          if (stockToReduce > 0) {
            await Product.updateOne(
              { _id: item._id },
              { $inc: { 'inventory.stockCount': -stockToReduce } }
            );
          }
        }
      }
    }

    // Clear the user's cart after successful order creation
    const userIdForCart = user._id || user.$id;
    if (userIdForCart) {
      await CartItem.deleteMany({ userId: userIdForCart });
    }

    console.log('Order creation completed successfully');
    console.log('Created orders:', orders.length);
    console.log('Order IDs:', orders.map(order => order._id.toString()));
    
    return {
      success: true,
      message: 'Orders created successfully',
      orders: orders,
      orderIds: orders.map(order => order._id.toString())
    };

  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    
    // More detailed error message based on error type
    let errorMessage = 'Failed to create order';
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid order data: ' + Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      errorMessage = 'Duplicate order detected';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'Authentication error: Please log in again';
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error.message,
      errorType: error.name
    };
  }
}

// Razorpay Integration
export async function createRazorpayOrder(orderIds) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to complete your purchase' };
    }

    console.log('Creating Razorpay order for IDs:', orderIds);
    
    // Find all orders by IDs
    const orders = await Order.find({ _id: { $in: orderIds } });
    console.log('Found orders for Razorpay:', orders.length);
    
    if (!orders.length) {
      return { success: false, message: 'No orders found for Razorpay payment' };
    }

    // Calculate total amount for all orders
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Initialize Razorpay
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `knitkart_${Date.now()}`,
      payment_capture: 1, // Auto-capture enabled
      notes: {
        orderIds: orderIds.join(','),
        buyer_id: user.$id,
        buyer_email: user.email
      }
    });

    // Update orders with Razorpay order ID
    await Promise.all(orders.map(order => 
      Order.findByIdAndUpdate(
        order._id, 
        { razorpayOrderId: razorpayOrder.id }
      )
    ));

    return {
      success: true,
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      orders
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      message: 'Failed to create payment order. Please try again.'
    };
  }
}

export async function verifyRazorpayPayment(paymentData) {
  console.log('Payment data:', paymentData);
  try {
    await dbConnect();
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    // Find orders with this Razorpay order ID
    const orders = await Order.find({ razorpayOrderId: razorpay_order_id });
    if (!orders.length) {
      return { success: false, message: 'No orders found for this payment' };
    }

    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return { success: false, message: 'Invalid payment signature' };
    }

    // Update orders with payment ID and status
    await Promise.all(orders.map(order => 
      Order.findByIdAndUpdate(
        order._id,
        { 
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: 'paid',
          status: 'processing'
        }
      )
    ));

    // Fetch updated orders with full details for email sending
    const orderIds = orders.map(order => order._id);
    console.log('Order IDs:', orderIds);
    const updatedOrders = await Order.find({ _id: { $in: orderIds } });
    console.log('Updated orders:', updatedOrders);
    // Get order items for each order
    const orderItems = await OrderItem.find({ 
      orderId: { $in: orderIds } 
    }).populate('productId');
    console.log('Order items:', orderItems);

    // Group order items by order ID for easy access
    const orderItemsMap = orderItems.reduce((acc, item) => {
      const orderId = item.orderId.toString();
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(item);
      return acc;
    }, {});
    console.log('Order items map:', orderItemsMap);
    
    // Update product inventory - decrement stock for each purchased item
    console.log('Updating product inventory...');
    try {
      // Create a list of inventory updates to perform
      const inventoryUpdates = orderItems.map(item => {
        const productId = item.productId._id;
        const quantity = item.quantity;
        
        // Return the update operation for this product
        return Product.findByIdAndUpdate(
          productId,
          { $inc: { 'inventory.stockCount': -quantity } },
          { new: true }
        );
      });
      
      // Execute all inventory updates in parallel
      const inventoryResults = await Promise.all(inventoryUpdates);
      console.log('Inventory updated successfully for', inventoryResults.length, 'products');
    } catch (inventoryError) {
      console.error('Error updating inventory:', inventoryError);
      // We'll continue the process even if inventory update fails
      // The order is already confirmed, and we'll need manual inventory adjustment
    }
    
    // Attach items to each order
    const ordersWithItems = updatedOrders.map(order => {
      return {
        ...order.toObject(),
        items: orderItemsMap[order._id.toString()] || []
      };
    });
    console.log('Orders with items:', ordersWithItems);
    return {
      success: true,
      message: 'Payment verified successfully',
      orders: JSON.parse(JSON.stringify(ordersWithItems))
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      message: 'Failed to verify payment. Please contact support.'
    };
  }
}

export async function getOrderDetails(orderIds) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to view orders' };
    }

    console.log('Getting order details for IDs:', orderIds);
    console.log('User ID for lookup:', user._id, 'Appwrite ID:', user.$id);
    
    // Find all orders by IDs and ensure they belong to this user
    // We need to check both MongoDB ID and Appwrite ID since we might have used either one
    const orders = await Order.find({ 
      _id: { $in: orderIds },
      $or: [
        { buyerId: user._id ? user._id.toString() : null },
        { buyerId: user.$id }
      ]
    });
    
    console.log('Found orders:', orders.length);
    
    if (!orders.length) {
      // Try to find the orders without the user ID filter to see if they exist at all
      const allOrders = await Order.find({ _id: { $in: orderIds } });
      console.log('Orders exist but might belong to different user:', allOrders.length);
      
      if (allOrders.length > 0) {
        console.log('Order buyer IDs:', allOrders.map(o => o.buyerId));
        return { 
          success: false, 
          message: 'Orders found but they do not belong to the current user',
          debug: {
            userIds: [user._id?.toString(), user.$id],
            orderBuyerIds: allOrders.map(o => o.buyerId)
          }
        };
      }
      
      return { success: false, message: 'No orders found with the provided IDs' };
    }

    // Get order items
    const orderItems = await OrderItem.find({ 
      orderId: { $in: orderIds } 
    }).populate('productId');

    // Group items by order
    const orderDetails = orders.map(order => {
      const items = orderItems.filter(item => 
        item.orderId.toString() === order._id.toString()
      );
      
      return {
        ...order.toObject(),
        items: items.map(item => item.toObject())
      };
    });

    return {
      success: true,
      orders: orderDetails
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    return {
      success: false,
      message: 'Failed to retrieve order details'
    };
  }
}

/**
 * Checks if all items in the cart are still available in the requested quantities
 * or available for made-to-order if backorder is allowed
 * Returns detailed information about any inventory issues
 */
export async function checkInventoryAvailability(cartItems) {
  try {
    await dbConnect();

    const inventoryChecks = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        console.log('Checking inventory for product:', product);
        
        if (!product) {
          return {
            productId: item._id,
            name: item.name,
            available: false,
            message: 'Product no longer exists',
            requestedQuantity: item.quantity,
            availableQuantity: 0,
            isMadeToOrder: false,
            madeToOrderDays: 0
          };
        }

        const allowBackorder = product.inventory?.allowBackorder || false;
        const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
        const stockCount = product.inventory.stockCount;
        
        // Product is available if either:
        // 1. There's enough stock, or
        // 2. Backorder is allowed (made-to-order)
        const isAvailable = stockCount >= item.quantity || allowBackorder;
        const isMadeToOrder = allowBackorder && stockCount < item.quantity;
        
        // Calculate how many items will be made to order
        const madeToOrderQuantity = isMadeToOrder ? item.quantity - stockCount : 0;
        
        let message = '';
        if (isAvailable) {
          if (isMadeToOrder) {
            if (stockCount > 0) {
              message = `${stockCount} in stock, ${madeToOrderQuantity} will be made to order (${madeToOrderDays} days)`;
            } else {
              message = `Made to order - will be delivered in ${madeToOrderDays} days`;
            }
          } else {
            message = 'In stock';
          }
        } else {
          message = `Only ${stockCount} items available`;
        }
        
        return {
          productId: item._id,
          name: item.name,
          available: isAvailable,
          message: message,
          requestedQuantity: item.quantity,
          availableQuantity: stockCount,
          isMadeToOrder: isMadeToOrder,
          madeToOrderDays: madeToOrderDays,
          madeToOrderQuantity: madeToOrderQuantity
        };
      })
    );

    const allAvailable = inventoryChecks.every(check => check.available);
    const unavailableItems = inventoryChecks.filter(check => !check.available);
    const madeToOrderItems = inventoryChecks.filter(check => check.isMadeToOrder);

    return {
      success: true,
      isAvailable: allAvailable,
      items: inventoryChecks,
      unavailableItems,
      madeToOrderItems,
      hasMadeToOrderItems: madeToOrderItems.length > 0,
      message: allAvailable 
        ? madeToOrderItems.length > 0
          ? 'Some items will be made to order'
          : 'All items are available'
        : 'Some items are no longer available in requested quantities'
    };
  } catch (error) {
    console.error('Error checking inventory:', error);
    return {
      success: false,
      message: 'Failed to check inventory availability',
      error: error.message
    };
  }
}

// Add a new address to user's addresses
export async function addNewAddress(addressData) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to add address' };
    }

    await User.updateOne(
      { _id: user._id },
      {
        $addToSet: {
          addresses: addressData
        }
      }
    );

    return { success: true, message: 'Address added successfully' };
  } catch (error) {
    console.error('Error adding address:', error);
    return { success: false, message: 'Failed to add address' };
  }
}

// Delete an address from user's addresses
export async function deleteAddress(addressId) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to delete address' };
    }

    await User.updateOne(
      { _id: user._id },
      {
        $pull: {
          addresses: { _id: addressId }
        }
      }
    );

    return { success: true, message: 'Address deleted successfully' };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, message: 'Failed to delete address' };
  }
}
