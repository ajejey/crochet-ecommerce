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
