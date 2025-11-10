

export const FREQUENCY_TYPES={
  DAILY: 'Everyday',
  WEEKDAYS: 'Weekdays only',
  WEEKENDS: 'Weekends only',
  THREE_WEEKLY: '3 times per week',
  WEEKLY: 'Once a week',
  TWO_WEEKLY: '2 times per week',
  FOUR_WEEKLY: '4 times per week',
  FIVE_WEEKLY: '5 times per week',
  BIWEEKLY: 'Every 2 weeks',
  MONTHLY: 'Once a month'
};

export const shouldTrackHabitOnDate = (frequency,date) => {
 const dayOfWeek = date.getDay();

 switch(frequency) {
    case FREQUENCY_TYPES.DAILY:
        return true;

    case FREQUENCY_TYPES.WEEKDAYS:
        return dayOfWeek >= 1 && dayOfWeek <=5;

    case FREQUENCY_TYPES.WEEKENDS:
        return dayOfWeek === 0 || dayOfWeek === 6;
    
    case FREQUENCY_TYPES.TWO_WEEKLY:
    case FREQUENCY_TYPES.THREE_WEEKLY:
    case '3x/week':
    case FREQUENCY_TYPES.FOUR_WEEKLY:
    case FREQUENCY_TYPES.FIVE_WEEKLY:  
     return true;

    case FREQUENCY_TYPES.WEEKLY:
        return true;

    case FREQUENCY_TYPES.BIWEEKLY:
        return true;

    case FREQUENCY_TYPES.MONTHLY:
        return true;

    default:
        return true;
 }
};

export const getRequiredCompletionsPerWeek = (frequency) => {
 switch(frequency) {
    case FREQUENCY_TYPES.DAILY:
      return 7;
    case FREQUENCY_TYPES.WEEKDAYS:
      return 5;
    case FREQUENCY_TYPES.WEEKENDS:
      return 2;
    case FREQUENCY_TYPES.FIVE_WEEKLY:
      return 5;
    case FREQUENCY_TYPES.FOUR_WEEKLY:
      return 4;
    case FREQUENCY_TYPES.THREE_WEEKLY:
      case '3x/week': 
      return 3;
    case FREQUENCY_TYPES.TWO_WEEKLY:
      return 2;
    case FREQUENCY_TYPES.WEEKLY:
    case 'Once a week': 
      return 1;
    case FREQUENCY_TYPES.BIWEEKLY:
      return 0.5;
    case FREQUENCY_TYPES.MONTHLY:
      return 0.25;
    default:
      console.log('No match found for frequency:', frequency);
      return 1;
 }
};

export const isHabitCompleteForPeriod = (frequency, completions, date = new Date()) => {
    const today = new Date(date);

    switch(frequency) {
       case FREQUENCY_TYPES.DAILY:
       case FREQUENCY_TYPES.WEEKDAYS:
       case FREQUENCY_TYPES.WEEKENDS:

       const dateStr = today.toISOString().split('T')[0];
       return completions[dateStr] || false;

       case FREQUENCY_TYPES.WEEKLY:
         return getCompletionsThisWeek(completions,today) >= 1;

       case FREQUENCY_TYPES.TWO_WEEKLY:
        return getCompletionsThisWeek(completions,today) >= 2;

       case FREQUENCY_TYPES.THREE_WEEKLY:
        case '3x/week':
        return getCompletionsThisWeek(completions,today) >= 3;
       
       case FREQUENCY_TYPES.FOUR_WEEKLY:
        return getCompletionsThisWeek(completions,today) >= 4;

       case FREQUENCY_TYPES.FIVE_WEEKLY:
        return getCompletionsThisWeek(completions,today) >= 5;
    
       case FREQUENCY_TYPES.BIWEEKLY:
         return getCompletionsLastNDays(completions,today,14) >= 1;

       case FREQUENCY_TYPES.MONTHLY:
        return getCompletionsThisMonth(completions,today) >= 1;

       default:
        return false;
    }
}

export const getCompletionsLastNDays = (completions, date = new Date(), days = 7) => {
    const today = new Date(date);
    let count=0;

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i); 
      const dateStr = checkDate.toISOString().split('T')[0];
    
    if (completions[dateStr]) {
      count++;
    }
 }
 return count;
}

export const getCompletionsThisMonth = (completions, date = new Date()) => {
  const today = new Date(date);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  let count = 0;
  const currentDate = new Date(startOfMonth);
  
  while (currentDate <= endOfMonth && currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completions[dateStr]) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};


export const calculateFrequencyAwareStreak = (frequency, completions, endDate = new Date()) => {
  const requiredPerWeek = getRequiredCompletionsPerWeek(frequency);
  let streak = 0;
  const today = new Date(endDate);

  console.log('Calculating streak for:', frequency, 'Required per week:', requiredPerWeek);
   
  if (frequency === FREQUENCY_TYPES.DAILY || 
      frequency === FREQUENCY_TYPES.WEEKDAYS || 
      frequency === FREQUENCY_TYPES.WEEKENDS) {
    
    let currentDate = new Date(today);
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const shouldTrack = shouldTrackHabitOnDate(frequency, currentDate);
      
      if (shouldTrack) {
        if (completions[dateStr]) {
          streak++;
        } else {
          break; 
        }
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
      if (streak > 365) break;
    }
    
    console.log('Daily/weekday streak result:', streak);
    return streak;
  }
  
  //  Fixed weekly streak calculation
  let currentWeekStart = getStartOfWeek(today);
  
  while (true) {
    const weekCompletions = getCompletionsInWeek(completions, currentWeekStart);
    const isCurrentWeek = isSameWeek(currentWeekStart, today);

    console.log(`Week starting ${currentWeekStart.toDateString()}: ${weekCompletions}/${requiredPerWeek} completions, isCurrentWeek: ${isCurrentWeek}`);
    
    //  Only count completed weeks (meeting the requirement)
    if (weekCompletions >= requiredPerWeek) {
      streak++;
      console.log(`Week completed! Streak now: ${streak}`);
    } else {
      // For current week, don't break streak if there's partial progress
      if (isCurrentWeek && weekCompletions > 0) {
        console.log('Current week with partial progress - not breaking streak yet');
        // Don't increment streak, but don't break it either
        break; // Stop counting but preserve existing streak
      } else {
        // Past week that wasn't completed - streak broken
        console.log(`Week not completed, breaking streak at: ${streak}`);
        break;
      }
    }
    
    // Move to previous week
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    //  Prevent infinite loop
    if (streak > 104) break;
  }
  
  //  Move console.log and return OUTSIDE the while loop
  console.log('Weekly streak final result:', streak);
  return streak;
};

export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getCompletionsInWeek = (completions,weekStart) => {
     let count = 0;

     for (let i = 0; i < 7; i++) {
       const checkDate = new Date(weekStart);
       checkDate.setDate(weekStart.getDate() + i);
       const dateStr = checkDate.toISOString().split('T')[0];
    
       if (completions[dateStr]) {
         count++;
       }
     }
  
    return count;
  };

export const getCompletionsThisWeek = (completions, date = new Date()) => {
  const startOfWeek = getStartOfWeek(date);
  return getCompletionsInWeek(completions, startOfWeek);
};

const isSameWeek = (date1, date2) => {
  const start1 = getStartOfWeek(date1);
  const start2 = getStartOfWeek(date2);
  return start1.getTime() === start2.getTime();
};
