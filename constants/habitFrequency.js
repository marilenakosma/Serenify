

export const FREQUENCY_TYPES = {
  DAILY: 'daily',           
  WEEKDAYS: 'weekdays',     
  WEEKENDS: 'weekends',     
  THREE_WEEKLY: 'threeWeekly', 
  WEEKLY: 'weekly',         
  TWO_WEEKLY: 'twoWeekly',  
  FOUR_WEEKLY: 'fourWeekly', 
  FIVE_WEEKLY: 'fiveWeekly', 
  BIWEEKLY: 'biweekly',     
  MONTHLY: 'monthly'        
};

export const migrateFrequencyToKey = (frequency) => {
  // If it's already a key, return it
  if (Object.values(FREQUENCY_TYPES).includes(frequency)) {
    return frequency;
  }
  
  // Map English display values to keys
  const mapping = {
    'Everyday': 'daily',
    'Weekdays only': 'weekdays',
    'Weekends only': 'weekends',
    '3 times per week': 'threeWeekly',
    'Once a week': 'weekly',
    '2 times per week': 'twoWeekly',
    '4 times per week': 'fourWeekly',
    '5 times per week': 'fiveWeekly',
    'Every 2 weeks': 'biweekly',
    'Once a month': 'monthly'
  };
  
  return mapping[frequency] || frequency;
};

export const getFrequencyDisplay = (frequency, t) => {
  if (!frequency) return '';
  
  
  // First try to migrate if it's a key
  const key = migrateFrequencyToKey(frequency);
  
  // Try to translate
  const translationKey = `frequency.${key}`;
  const translated = t(translationKey);
  
  // If translation returns the key itself (meaning no translation found),
  // the frequency might already be translated, so just return it
  if (translated === translationKey || translated === `frequency.${key}`) {
    return frequency; // Return as-is (already translated)
  }
  
  return translated;
};

export const shouldTrackHabitOnDate = (frequency, date) => {
  const dayOfWeek = date.getDay();

  switch(frequency) {
    case FREQUENCY_TYPES.DAILY:
    case 'daily': //  Add backward compatibility
      return true;

    case FREQUENCY_TYPES.WEEKDAYS:
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;

    case FREQUENCY_TYPES.WEEKENDS:
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    
    case FREQUENCY_TYPES.TWO_WEEKLY:
    case 'twoWeekly':
    case FREQUENCY_TYPES.THREE_WEEKLY:
    case 'threeWeekly':
    case '3x/week': // Keep for backward compatibility
    case FREQUENCY_TYPES.FOUR_WEEKLY:
    case 'fourWeekly':
    case FREQUENCY_TYPES.FIVE_WEEKLY:
    case 'fiveWeekly':
      return true;

    case FREQUENCY_TYPES.WEEKLY:
    case 'weekly':
      return true;

    case FREQUENCY_TYPES.BIWEEKLY:
    case 'biweekly':
      return true;

    case FREQUENCY_TYPES.MONTHLY:
    case 'monthly':
      return true;

    //  Add backward compatibility for old English values
    case 'Everyday':
      return true;
    case 'Weekdays only':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'Weekends only':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case '3 times per week':
    case '2 times per week':
    case '4 times per week':
    case '5 times per week':
      return true;
    case 'Once a week':
    case 'Every 2 weeks':
    case 'Once a month':
      return true;

    default:
      return true;
  }
};

export const getRequiredCompletionsPerWeek = (frequency) => {
  switch(frequency) {
    case FREQUENCY_TYPES.DAILY:
    case 'daily':
    case 'Everyday': //  Backward compatibility
      return 7;
    case FREQUENCY_TYPES.WEEKDAYS:
    case 'weekdays':
    case 'Weekdays only':
      return 5;
    case FREQUENCY_TYPES.WEEKENDS:
    case 'weekends':
    case 'Weekends only':
      return 2;
    case FREQUENCY_TYPES.FIVE_WEEKLY:
    case 'fiveWeekly':
    case '5 times per week':
      return 5;
    case FREQUENCY_TYPES.FOUR_WEEKLY:
    case 'fourWeekly':
    case '4 times per week':
      return 4;
    case FREQUENCY_TYPES.THREE_WEEKLY:
    case 'threeWeekly':
    case '3x/week':
    case '3 times per week':
      return 3;
    case FREQUENCY_TYPES.TWO_WEEKLY:
    case 'twoWeekly':
    case '2 times per week':
      return 2;
    case FREQUENCY_TYPES.WEEKLY:
    case 'weekly':
    case 'Once a week':
      return 1;
    case FREQUENCY_TYPES.BIWEEKLY:
    case 'biweekly':
    case 'Every 2 weeks':
      return 0.5;
    case FREQUENCY_TYPES.MONTHLY:
    case 'monthly':
    case 'Once a month':
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
    case 'daily':
    case 'Everyday':
    case FREQUENCY_TYPES.WEEKDAYS:
    case 'weekdays':
    case 'Weekdays only':
    case FREQUENCY_TYPES.WEEKENDS:
    case 'weekends':
    case 'Weekends only':
      const dateStr = today.toISOString().split('T')[0];
      return completions[dateStr] || false;

    case FREQUENCY_TYPES.WEEKLY:
    case 'weekly':
    case 'Once a week':
      return getCompletionsThisWeek(completions, today) >= 1;

    case FREQUENCY_TYPES.TWO_WEEKLY:
    case 'twoWeekly':
    case '2 times per week':
      return getCompletionsThisWeek(completions, today) >= 2;

    case FREQUENCY_TYPES.THREE_WEEKLY:
    case 'threeWeekly':
    case '3x/week':
    case '3 times per week':
      return getCompletionsThisWeek(completions, today) >= 3;
    
    case FREQUENCY_TYPES.FOUR_WEEKLY:
    case 'fourWeekly':
    case '4 times per week':
      return getCompletionsThisWeek(completions, today) >= 4;

    case FREQUENCY_TYPES.FIVE_WEEKLY:
    case 'fiveWeekly':
    case '5 times per week':
      return getCompletionsThisWeek(completions, today) >= 5;

    case FREQUENCY_TYPES.BIWEEKLY:
    case 'biweekly':
    case 'Every 2 weeks':
      return getCompletionsLastNDays(completions, today, 14) >= 1;

    case FREQUENCY_TYPES.MONTHLY:
    case 'monthly':
    case 'Once a month':
      return getCompletionsThisMonth(completions, today) >= 1;

    default:
      return false;
  }
};

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

 // console.log('Calculating streak for:', frequency, 'Required per week:', requiredPerWeek);
   
  if (frequency === FREQUENCY_TYPES.DAILY || frequency === 'daily' || frequency === 'Everyday' ||
      frequency === FREQUENCY_TYPES.WEEKDAYS || frequency === 'weekdays' || frequency === 'Weekdays only' ||
      frequency === FREQUENCY_TYPES.WEEKENDS || frequency === 'weekends' || frequency === 'Weekends only') {
    
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
    
    //console.log('Daily/weekday streak result:', streak);
    return streak;
  }
  
  // Rest of the function stays the same...
  let currentWeekStart = getStartOfWeek(today);
  
  while (true) {
    const weekCompletions = getCompletionsInWeek(completions, currentWeekStart);
    const isCurrentWeek = isSameWeek(currentWeekStart, today);

   // console.log(`Week starting ${currentWeekStart.toDateString()}: ${weekCompletions}/${requiredPerWeek} completions, isCurrentWeek: ${isCurrentWeek}`);
    
    if (weekCompletions >= requiredPerWeek) {
      streak++;
      //console.log(`Week completed! Streak now: ${streak}`);
    } else {
      if (isCurrentWeek && weekCompletions > 0) {
       // console.log('Current week with partial progress - not breaking streak yet');
        break;
      } else {
        //console.log(`Week not completed, breaking streak at: ${streak}`);
        break;
      }
    }
    
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    
    if (streak > 104) break;
  }
  
  //console.log('Weekly streak final result:', streak);
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

//Check if points have already been awarded for a habit on a specific date
export const hasPointsBeenAwarded = (completions,habitId,dateStr) => {
  if(!completions[habitId]) 
    return false;
  return completions[habitId][`${dateStr}_pointsAwarded` || false]
};

export const markPointsAwarded = (completions,habitId,dateStr) => {
 if(!completions[habitId]) {
  completions[habitId] = {};
 }
   completions[habitId][`${dateStr}_pointsAwarded`] = true;
   return completions;
}

export const clearPointsAwarded = (completions,habitId,dateStr) => {
  if (!completions[habitId]) 
    return completions;
  completions[habitId][`${dateStr}_pointsAwarded`] = false;
  return completions;
}

export const canToggleHabitCompletion = (completions,habitId,dateStr,allowUncomplete = false) => {
  const isCurrentlyCompleted = completions[habitId]?.[dateStr] || false;
  
  // If already completed and uncompleting is not allowed
  if (isCurrentlyCompleted && !allowUncomplete) {
    return { canToggle: false, reason: 'already_completed' };
  }
  
  return { canToggle: true };
}
