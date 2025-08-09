/**
 * Formats a price number with comma separators for thousands
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number
  if (isNaN(numPrice)) return '0';
  
  // Format with comma separators
  return numPrice.toLocaleString();
}; 

// utils/timeAgo.js
export function getTimeAgo(dateString) {
  const now = new Date();
  const inputDate = new Date(dateString);
  const diffInMs = now - inputDate;
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSec < 5) return "Just now";
  if (diffInSec < 60) return `${diffInSec} seconds ago`;
  if (diffInMin < 60) return `${diffInMin} minute${diffInMin === 1 ? "" : "s"} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}
