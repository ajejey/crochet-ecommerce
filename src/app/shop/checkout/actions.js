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

    // Update user details and add new address if it doesn't exist
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          name: orderData.buyerName,
          phone: orderData.buyerPhone,
          email: orderData.buyerEmail,
        },
        $addToSet: { // Only adds if the address doesn't exist
          addresses: addressData
        }
      }
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

    return { success: true, userDetails };
  } catch (error) {
    console.error('Error getting user details:', error);
    return { success: false, message: 'Failed to retrieve user details' };
  }
}

export async function createOrder(orderData) {
  try {
    await dbConnect();
    
    const user = await getAuthUser();
    if (!user) {
      return { success: false, message: 'Please login to create order' };
    }

    // Group items by seller
    const itemsBySeller = orderData.items.reduce((acc, item) => {
      const sellerId = item.sellerId;
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
        return sum + (item.price * item.quantity);
      }, 0);

      // Calculate fees and amounts for this seller
      const platformFeePercentage = 0.10; // 10% platform fee
      const platformFee = sellerTotal * platformFeePercentage;
      const sellerAmount = sellerTotal - platformFee;

      // Create order for this seller
      const order = await Order.create({
        buyerId: user.$id,
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
      });

      orders.push(order);

      // Create order items for this seller
      const orderItemsForSeller = items.map(item => ({
        orderId: order._id,
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      orderItems.push(...orderItemsForSeller);
    }

    // Create all order items in bulk
    await OrderItem.insertMany(orderItems);

    return {
      success: true,
      message: 'Orders created successfully',
      orders: orders,
      orderIds: orders.map(order => order._id)
    };

  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: 'Failed to create order',
      error: error.message
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

    // Find all orders by IDs
    const orders = await Order.find({ _id: { $in: orderIds } });
    if (!orders.length) {
      return { success: false, message: 'No orders found' };
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

    // Find all orders by IDs and ensure they belong to this user
    const orders = await Order.find({ 
      _id: { $in: orderIds }, 
      buyerId: user.$id 
    });
    
    if (!orders.length) {
      return { success: false, message: 'No orders found' };
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
 * Returns detailed information about any inventory issues
 */
export async function checkInventoryAvailability(cartItems) {
  try {
    await dbConnect();

    const inventoryChecks = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        
        if (!product) {
          return {
            productId: item._id,
            name: item.name,
            available: false,
            message: 'Product no longer exists',
            requestedQuantity: item.quantity,
            availableQuantity: 0
          };
        }

        const isAvailable = product.inventory.stockCount >= item.quantity;
        return {
          productId: item._id,
          name: item.name,
          available: isAvailable,
          message: isAvailable 
            ? 'In stock' 
            : `Only ${product.inventory.stockCount} items available`,
          requestedQuantity: item.quantity,
          availableQuantity: product.inventory.stockCount
        };
      })
    );

    const allAvailable = inventoryChecks.every(check => check.available);
    const unavailableItems = inventoryChecks.filter(check => !check.available);

    return {
      success: true,
      isAvailable: allAvailable,
      items: inventoryChecks,
      unavailableItems,
      message: allAvailable 
        ? 'All items are available' 
        : `Some items are no longer available in requested quantities`
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
