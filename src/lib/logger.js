'use server';

import dbConnect from '@/lib/mongodb';
import SystemLog from '@/models/SystemLog';

/**
 * Logger service for tracking system events and errors
 * This provides a centralized way to log important events and errors
 * Logs are stored in MongoDB for persistence and easy querying
 */
/**
 * Log an informational message
 * @param {string} category - The category of the log (payment, order, shipping, etc.)
 * @param {string} message - A descriptive message
 * @param {Object} details - Additional details about the event
 * @param {Object} context - Context information like userId, orderId, etc.
 */
export async function info(category, message, details = {}, context = {}) {
  return createLog('info', category, message, details, context);
}

/**
 * Log a warning message
 * @param {string} category - The category of the log
 * @param {string} message - A descriptive message
 * @param {Object} details - Additional details about the warning
 * @param {Object} context - Context information like userId, orderId, etc.
 */
export async function warning(category, message, details = {}, context = {}) {
  return createLog('warning', category, message, details, context);
}

/**
 * Log an error message
 * @param {string} category - The category of the log
 * @param {string} message - A descriptive message
 * @param {Object|Error} error - The error object or details
 * @param {Object} context - Context information like userId, orderId, etc.
 */
export async function error(category, message, error = {}, context = {}) {
  // Process Error objects to extract useful information
  const details = error instanceof Error 
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error
      }
    : error;
  
  return createLog('error', category, message, details, context);
}

/**
 * Log a critical error that requires immediate attention
 * @param {string} category - The category of the log
 * @param {string} message - A descriptive message
 * @param {Object|Error} error - The error object or details
 * @param {Object} context - Context information like userId, orderId, etc.
 */
export async function critical(category, message, error = {}, context = {}) {
  // Process Error objects to extract useful information
  const details = error instanceof Error 
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error
      }
    : error;
  
  return createLog('critical', category, message, details, context);
}

/**
 * Retrieve logs with filtering options
 * @param {Object} filters - Filtering criteria
 * @param {Object} options - Pagination and sorting options
 */
export async function getLogs(filters = {}, options = { limit: 100, skip: 0, sort: { createdAt: -1 } }) {
  try {
    await dbConnect();
    
    const logs = await SystemLog.find(filters)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .lean();
    
    const count = await SystemLog.countDocuments(filters);
    
    return {
      success: true,
      logs,
      count,
      pagination: {
        page: Math.floor(options.skip / options.limit) + 1,
        limit: options.limit,
        totalPages: Math.ceil(count / options.limit),
        totalItems: count
      }
    };
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return {
      success: false,
      message: 'Failed to retrieve logs',
      error: error.message
    };
  }
}

/**
 * Mark a log as resolved
 * @param {string} logId - The ID of the log to resolve
 * @param {string} resolvedBy - User ID or name of who resolved it
 * @param {string} notes - Resolution notes
 */
export async function resolveLog(logId, resolvedBy, notes = '') {
  try {
    await dbConnect();
    
    const log = await SystemLog.findByIdAndUpdate(
      logId,
      {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy,
        resolvedNotes: notes
      },
      { new: true }
    );
    
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

/**
 * Internal helper function to create a log entry
 * This is now non-blocking - it logs to console immediately and handles DB operations in the background
 */
async function createLog(level, category, message, details = {}, context = {}) {
  try {
    // Extract context fields for console logging
    const { userId, orderId, sellerId, ...otherDetails } = context;
    
    // Combine details with other context details
    const fullDetails = {
      ...details,
      ...otherDetails
    };
    
    // Log to console immediately for visibility (this is fast)
    logToConsole(level, category, message, fullDetails, context);
    
    // Fire and forget - don't await the database operation
    // This ensures user flows aren't blocked by logging operations
    dbLogOperation(level, category, message, fullDetails, { userId, orderId, sellerId })
      .catch(err => console.error('Background logging error:', err));
    
    // Return immediately with success
    return { success: true };
  } catch (error) {
    // If logging itself fails, at least log to console
    console.error('Error in log processing:', error);
    console.error('Original log:', { level, category, message, details, context });
    
    return {
      success: false,
      message: 'Failed to process log',
      error: error.message
    };
  }
}

/**
 * Helper function to log to console
 * @private
 */
function logToConsole(level, category, message, details, context) {
  const consoleMessage = `[${level.toUpperCase()}][${category}] ${message}`;
  
  switch (level) {
    case 'info':
      console.log(consoleMessage, { details, context });
      break;
    case 'warning':
      console.warn(consoleMessage, { details, context });
      break;
    case 'error':
    case 'critical':
      console.error(consoleMessage, { details, context });
      break;
  }
}

/**
 * Helper function to handle database operations asynchronously
 * @private
 */
async function dbLogOperation(level, category, message, details, context) {
  try {
    await dbConnect();
    
    // Extract context fields
    const { userId, orderId, sellerId } = context;
    
    // Create the log entry
    await SystemLog.create({
      level,
      category,
      message,
      details,
      userId,
      orderId,
      sellerId
    });
  } catch (error) {
    // If database logging fails, log to console but don't throw
    // This prevents background errors from affecting anything else
    console.error('Background log creation failed:', error);
  }
}
