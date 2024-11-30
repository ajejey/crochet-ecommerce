'use server';

import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

// Helper function to subtract days from a date
function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

// Helper function to format date as 'MMM d' (e.g., 'Jan 15')
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Helper function to format date as 'YYYY-MM-DD'
function formatDateYYYYMMDD(date) {
  return date.toISOString().split('T')[0];
}

export async function getDashboardStats(userId) {
  await dbConnect();

  // Get product stats
  const [activeProducts, lowStockProducts] = await Promise.all([
    Product.countDocuments({ sellerId: userId, status: 'active' }),
    Product.countDocuments({ 
      sellerId: userId, 
      status: 'active',
      'inventory.stockCount': { $lte: 5 }
    })
  ]);

  // Get order stats
  const [totalOrders, totalRevenue, revenueData] = await Promise.all([
    Order.countDocuments({ sellerId: userId }),
    Order.aggregate([
      { $match: { sellerId: userId } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]).then(result => result[0]?.total || 0),
    getRevenueData(userId)
  ]);

  // Calculate revenue trend (% change from last 30 days vs previous 30 days)
  const thirtyDaysAgo = subtractDays(new Date(), 30);
  const sixtyDaysAgo = subtractDays(new Date(), 60);

  const [currentPeriodRevenue, previousPeriodRevenue] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          sellerId: userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]).then(result => result[0]?.total || 0),
    Order.aggregate([
      {
        $match: {
          sellerId: userId,
          createdAt: {
            $gte: sixtyDaysAgo,
            $lt: thirtyDaysAgo
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]).then(result => result[0]?.total || 0)
  ]);

  const revenueTrend = previousPeriodRevenue === 0
    ? 100
    : Math.round(((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100);

  return {
    activeProducts,
    lowStockProducts,
    totalOrders,
    totalRevenue,
    revenueTrend,
    revenueData
  };
}

async function getRevenueData(userId) {
  const thirtyDaysAgo = subtractDays(new Date(), 30);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        sellerId: userId,
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Fill in missing dates with zero revenue
  const data = [];
  let currentDate = thirtyDaysAgo;
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Include all of today

  while (currentDate <= today) {
    const dateStr = formatDateYYYYMMDD(currentDate);
    const dayData = dailyRevenue.find(d => d._id === dateStr);
    
    data.push({
      date: formatDate(currentDate),
      revenue: dayData ? dayData.revenue : 0
    });

    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return data;
}

export async function getRecentOrders(userId, limit = 5) {
  await dbConnect();

  return Order.find({ sellerId: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getTopProducts(userId, limit = 5) {
  await dbConnect();

  // Get products with the highest total sales
  const products = await Product.aggregate([
    {
      $match: { sellerId: userId }
    },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'items.productId',
        as: 'orders'
      }
    },
    {
      $addFields: {
        totalSales: { $size: '$orders' }
      }
    },
    {
      $sort: { totalSales: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        orders: 0
      }
    }
  ]);

  return products;
}
