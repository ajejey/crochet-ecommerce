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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date not available';
  }
}
