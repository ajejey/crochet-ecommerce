export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateInput) {
  try {
    // If dateInput is null or undefined, return a placeholder
    if (!dateInput) return 'Date not available';

    // If dateInput is an object with short/full properties, return the full date
    if (typeof dateInput === 'object' && !dateInput instanceof Date) {
      return dateInput.full || dateInput.short || 'Date not available';
    }

    // Convert to Date object if it's not already
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date not available';
  }
}

/**
 * Format a date with time in a readable format
 * @param {Date|string} dateInput - The date to format
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateInput) {
  try {
    // If dateInput is null or undefined, return a placeholder
    if (!dateInput) return 'Date not available';

    // Convert to Date object if it's not already
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Date not available';
  }
}

/**
 * Get the start of the day (midnight) for a given date
 * @param {Date} date - The date to get start of day for
 * @returns {Date} Date object set to midnight (start of day)
 */
export function startOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of the day (23:59:59.999) for a given date
 * @param {Date} date - The date to get end of day for
 * @returns {Date} Date object set to end of day
 */
export function endOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Subtract days from a date
 * @param {Date} date - The starting date
 * @param {number} days - Number of days to subtract
 * @returns {Date} New date with days subtracted
 */
export function subDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

/**
 * Get the start of the week (Monday) for a given date
 * @param {Date} date - The date within the week
 * @returns {Date} Date object set to start of week (Monday)
 */
export function startOfWeek(date) {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of the week (Sunday) for a given date
 * @param {Date} date - The date within the week
 * @returns {Date} Date object set to end of week (Sunday)
 */
export function endOfWeek(date) {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() + (day === 0 ? 0 : 7 - day); // Adjust for Sunday
  newDate.setDate(diff);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Get the start of the month for a given date
 * @param {Date} date - The date within the month
 * @returns {Date} Date object set to start of month
 */
export function startOfMonth(date) {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of the month for a given date
 * @param {Date} date - The date within the month
 * @returns {Date} Date object set to end of month
 */
export function endOfMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(0); // Last day of previous month
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

// formatDistanceToNow
/**
 * Format distance from a date to now in a human-readable format
 * @param {Date|string} date - The date to calculate distance from
 * @param {Object} options - Options for formatting
 * @param {boolean} [options.addSuffix=false] - Whether to add 'ago' suffix
 * @param {boolean} [options.includeSeconds=false] - Whether to include seconds for recent times
 * @returns {string} Human-readable time distance
 */
export function formatDistanceToNow(date, options = {}) {
  try {
    if (!date) return 'Date not available';
    
    const targetDate = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    const { addSuffix = false, includeSeconds = false } = options;
    
    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    
    let result;
    
    if (diffInSeconds < minute) {
      result = includeSeconds
        ? diffInSeconds < 5
          ? 'just now'
          : diffInSeconds < 10
            ? 'less than 10 seconds'
            : diffInSeconds < 20
              ? 'less than 20 seconds'
              : diffInSeconds < 40
                ? 'half a minute'
                : 'less than a minute'
        : 'less than a minute';
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      result = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      result = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (diffInSeconds < month) {
      const days = Math.floor(diffInSeconds / day);
      result = `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month);
      result = `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffInSeconds / year);
      result = `${years} ${years === 1 ? 'year' : 'years'}`;
    }
    
    return addSuffix ? `${result} ago` : result;
  } catch (error) {
    console.error('Error formatting distance to now:', error);
    return 'Time calculation error';
  }
}


