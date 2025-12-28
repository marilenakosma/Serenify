/**
 * Format a date/timestamp for display using the user's locale
 * @param {string|Date|Object} timestamp - ISO string, Date object, or Firestore Timestamp
 * @param {string} currentLanguage - 'en' or 'el'
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, currentLanguage = 'en', includeTime = true) => {
  try {
    let date;
    
    // Handle Firestore Timestamp objects
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', timestamp);
      return 'Invalid Date';
    }

    const locale = currentLanguage === 'el' ? 'el-GR' : 'en-US';
    const timeZone = currentLanguage === 'el' ? 'Europe/Athens' : Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Format time
    const timeStr = includeTime ? date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timeZone
    }) : '';
    
    // Check if today or yesterday
    if (dateToCheck.getTime() === today.getTime()) {
      const todayLabel = currentLanguage === 'el' ? 'Σήμερα' : 'Today';
      return includeTime ? `${todayLabel} ${timeStr}` : todayLabel;
    } else if (dateToCheck.getTime() === yesterday.getTime()) {
      const yesterdayLabel = currentLanguage === 'el' ? 'Χθες' : 'Yesterday';
      return includeTime ? `${yesterdayLabel} ${timeStr}` : yesterdayLabel;
    }
    
    // Format full date
    const dateStr = date.toLocaleDateString(locale, {
      timeZone: timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return includeTime ? `${dateStr} ${timeStr}` : dateStr;
  } catch (error) {
    console.error('Error formatting date:', error, timestamp);
    return 'Invalid Date';
  }
};