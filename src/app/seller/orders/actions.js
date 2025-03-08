'use server';

import { getAuthUser } from '@/lib/auth-context';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { Product } from '@/models/Product';
import { SellerProfile } from '@/models/SellerProfile';
import dbConnect from '@/lib/mongodb';

// Cache seller profile to avoid repeated lookups
let cachedSellerProfile = null;

async function getSellerProfile() {
  if (cachedSellerProfile) return cachedSellerProfile;

  const user = await getAuthUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  await dbConnect();

  // Get seller profile
  const sellerProfile = await SellerProfile.findOne({ userId: user.$id }).lean();
  if (!sellerProfile) {
    throw new Error('Seller profile not found');
  }

  // Transform the data
  cachedSellerProfile = {
    ...sellerProfile,
    _id: sellerProfile._id.toString(),
    userId: sellerProfile.userId
  };
  
  return cachedSellerProfile;
}

export async function getSellerOrders({ status, search, page = 1, limit = 10 } = {}) {
  try {
    await dbConnect();
    const seller = await getSellerProfile();
    console.log('Seller profile:', seller); // Debug log
    
    if (!seller) {
      return { 
        success: false, 
        message: 'Seller profile not found' 
      };
    }

    // Build query
    const query = { sellerId: seller.userId };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    console.log('Query:', query); // Debug log
    console.log('Total orders found:', total); // Debug log

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();


    // Get all order items for these orders
    const orderItems = await OrderItem.find({
      orderId: { $in: orders.map(order => order._id) }
    })
      .populate({
        path: 'productId',
        model: Product,
        select: 'name description price images status'
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


    // Transform orders data
    const transformedOrders = orders.map(order => {
      const items = orderItemsMap[order._id.toString()] || [];
      
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = order.tax || 0;
      const shipping = order.shipping || 0;
      const total = subtotal + tax + shipping;

      // Transform items to include product details
      const transformedItems = items.map(item => ({
        ...item,
        product: item.productId ? {
          ...item.productId,
          mainImage: item.productId?.images?.find(img => img.isMain)?.url || 
                    item.productId?.images?.[0]?.url || 
                    '/placeholder-product.jpg'
        } : {
          name: 'Product Not Found',
          description: 'This product is no longer available',
          price: item.price,
          mainImage: '/placeholder-product.jpg'
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
        _id: order._id.toString(),
        items: transformedItems,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      };
    });


    return {
      success: true,
      orders: transformedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return {
      success: false,
      message: 'Failed to load orders. Please try again.'
    };
  }
}

export async function getOrderBasicDetails(orderId) {
  try {
    await dbConnect();
    const order = await Order.findById(orderId).lean();
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Verify seller ownership
    const seller = await getSellerProfile();
    if (order.sellerId !== seller.userId) {
      return { success: false, message: 'Order not found' };
    }

    return {
      success: true,
      order: {
        ...order,
        _id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { success: false, message: 'Failed to load order details' };
  }
}

export async function getOrderItems(orderId) {
  try {
    await dbConnect();
    
    // First verify seller ownership
    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const seller = await getSellerProfile();
    if (order.sellerId !== seller.userId) {
      return { success: false, message: 'Order not found' };
    }

    // Get order items with product details
    const items = await OrderItem.find({ orderId })
      .populate({
        path: 'productId',
        model: Product,
        select: 'name description price images'
      })
      .lean();

    const transformedItems = items.map(item => ({
      ...item,
      _id: item._id.toString(),
      productId: item.productId._id.toString(),
      product: item.productId ? {
        ...item.productId,
        mainImage: item.productId?.images?.find(img => img.isMain)?.url || 
                  item.productId?.images?.[0]?.url || 
                  '/placeholder-product.jpg'
      } : {
        name: 'Product Not Found',
        description: 'This product is no longer available',
        price: item.price,
        mainImage: '/placeholder-product.jpg'
      }
    }));

    return {
      success: true,
      items: transformedItems
    };
  } catch (error) {
    console.error('Error fetching order items:', error);
    return { success: false, message: 'Failed to load order items' };
  }
}

export async function getBuyerDetails(orderId) {
  try {
    await dbConnect();
    
    // Get order and verify ownership
    const order = await Order.findById(orderId).lean();
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    const seller = await getSellerProfile();
    if (order.sellerId !== seller.userId) {
      return { success: false, message: 'Order not found' };
    }

    return {
      success: true,
      buyer: {
        name: order.buyerName,
        email: order.buyerEmail,
        phone: order.buyerPhone,
        address: {
          street: order.shippingAddress,
          city: order.shippingCity,
          state: order.shippingState,
          pincode: order.shippingPincode
        }
      }
    };
  } catch (error) {
    console.error('Error fetching buyer details:', error);
    return { success: false, message: 'Failed to load buyer details' };
  }
}

export async function getOrderStatus(orderId) {
  try {
    const seller = await getSellerProfile();
    if (!seller) {
      return { 
        success: false, 
        message: 'Seller profile not found' 
      };
    }

    // Get order and verify ownership
    const order = await Order.findOne({ _id: orderId, sellerId: seller.userId });
    if (!order) {
      return {
        success: false,
        message: 'Order not found'
      };
    }

    return {
      success: true,
      status: order.status
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await dbConnect();
    
    const seller = await getSellerProfile();
    console.log('Seller:', { userId: seller?.userId });
    
    if (!seller) {
      return { 
        success: false, 
        message: 'Seller profile not found' 
      };
    }

    // Find and update the order
    const existingOrder = await Order.findById(orderId).lean();
    console.log('Existing Order:', { 
      orderId,
      sellerId: existingOrder?.sellerId,
      status: existingOrder?.status 
    });

    const order = await Order.findOneAndUpdate(
      { 
        _id: orderId,
        sellerId: seller.userId
      },
      { 
        $set: { 
          status: newStatus,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).lean();

    console.log('Update Result:', { 
      success: !!order,
      newStatus,
      updatedStatus: order?.status 
    });

    if (!order) {
      return {
        success: false,
        message: 'Order not found or you do not have permission to update it'
      };
    }

    return {
      success: true,
      message: 'Order status updated successfully',
      order: {
        ...order,
        _id: order._id.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      }
    };

  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: 'Failed to update order status. Please try again.'
    };
  }
}
