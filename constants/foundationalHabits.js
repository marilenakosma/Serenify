export const getFoundationalHabits = (t) => [
    { 
      id: 'complete-goal', 
      icon: 'checkmark-outline', 
      title: t('habits.foundation.dailyGoal'), 
      category: t('categories.foundation'), 
      points: 10, 
      duration: t('durations.5min'),
      frequency: 'daily', 
      type: 'simple'
    },
    { 
      id: 'reflection', 
      icon: 'journal-outline', 
      title: t('habits.foundation.writeReflection'), 
      category: t('categories.foundation'), 
      points: 15, 
      duration: t('durations.10min'),
      frequency: 'daily',
      type: 'simple'
    },
    { 
      id: 'affirmation', 
      icon: 'heart-outline', 
      title: t('habits.foundation.affirmations'), 
      category: t('categories.foundation'), 
      points: 10, 
      duration: t('durations.5min'),
      frequency: 'daily',
      type: 'simple'
    },
    { 
      id: 'exercise', 
      icon: 'fitness-outline', 
      title: t('habits.foundation.exercise'), 
      category: t('categories.foundation'), 
      points: 20, 
      duration: t('durations.20min'),
      frequency: 'daily',
      type: 'simple'
    },
  ];