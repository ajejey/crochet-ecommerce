'use server';

import dbConnect from '@/lib/mongodb';
import SystemLog from '@/models/SystemLog';
import { getAuthUser } from '@/lib/auth-context';
import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from '@/utils/format';

/**
 * Get logs with filtering and pagination
 */
export async function getLogs({ filters = {}, pagination = { page: 1, limit: 50 } }) {
  try {
    // Check if user is admin
    const user = await getAuthUser();
    if (!user || (user.role !== 'admin')) {
      return {
        success: false,
        message: 'Unauthorized access'
      };
    }

    await dbConnect();

    // Build query filters
    const query = {};
    
    // Filter by level
    if (filters.level) {
      query.level = filters.level;
    }
    
    // Filter by category
    if (filters.category) {
      query.category = filters.category;
    }
    
    // Filter by resolved status
    if (filters.resolved !== undefined) {
      query.resolved = filters.resolved;
    }
    
    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          query.createdAt = {
            $gte: startOfDay(now),
            $lte: endOfDay(now)
          };
          break;
        case 'yesterday':
          const yesterday = subDays(now, 1);
          query.createdAt = {
            $gte: startOfDay(yesterday),
            $lte: endOfDay(yesterday)
          };
          break;
        case 'week':
          query.createdAt = {
            $gte: startOfWeek(now, { weekStartsOn: 1 }),
            $lte: endOfWeek(now, { weekStartsOn: 1 })
          };
          break;
        case 'month':
          query.createdAt = {
            $gte: startOfMonth(now),
            $lte: endOfMonth(now)
          };
          break;
      }
    }
    
    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;
    
    // Get logs with pagination
    const logs = await SystemLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pagination.limit)
      .lean();
    
    // Get total count for pagination
    const totalItems = await SystemLog.countDocuments(query);
    
    return {
      success: true,
      logs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(totalItems / pagination.limit),
        totalItems
      }
    };
  } catch (error) {
    console.error('Error getting logs:', error);
    return {
      success: false,
      message: 'Failed to get logs',
      error: error.message
    };
  }
}

/**
 * Mark a log as resolved
 */
export async function resolveLog(logId, resolvedBy, notes = '') {
  try {
    // Check if user is admin
    const user = await getAuthUser();
    if (!user || (user.role !== 'admin')) {
      return {
        success: false,
        message: 'Unauthorized access'
      };
    }

    await dbConnect();
    
    const log = await SystemLog.findByIdAndUpdate(
      logId,
      {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: resolvedBy || user.name || user._id,
        resolvedNotes: notes
      },
      { new: true }
    );
    
    if (!log) {
      return {
        success: false,
        message: 'Log not found'
      };
    }
    
    return {
      success: true,
      log
    };
  } catch (error) {
    console.error('Error resolving log:', error);
    return {
      success: false,
      message: 'Failed to resolve log',
      error: error.message
    };
  }
}
