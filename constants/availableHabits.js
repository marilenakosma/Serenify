import { FREQUENCY_TYPES } from './habitFrequency';

export const getCategoryColor = (category, t) => {
  const colorMap = {
    [t('categories.foundation')]:'#E8B86D',
    [t('categories.health')]:'#A5B68D',      
    [t('categories.fitness')]: '#6B9E78',    
    [t('categories.mindfulness')]: '#7BA3C1', 
    [t('categories.learning')]: '#E89D6B',    
    [t('categories.reflection')]: '#C17BA3',  
    [t('categories.productivity')]: '#6B9E9E',
    [t('categories.meditation')]: '#9E8BC1',  
    [t('categories.lifestyle')]: '#A89C94',   
    [t('categories.social')]: '#E89C7B',      
    [t('categories.home')]: '#E89C7B',        
    [t('categories.selfcare')]: '#D989AA',    
  };
  
  return colorMap[category] || '#4CAF50'; // fallback
};

export const getAvailableHabits = (t) => ({
  common: [
    {
      id: 'water-intake',
      icon: 'water-outline',
      title: t('habits.common.waterIntake.title'),
      description: t('habits.common.waterIntake.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.allDay'),
      points: 15,
      type: 'incremental',
      target: 2000,
      unit: 'ml',
      increment: 250,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'no-screen-before-bed',
      icon: 'phone-portrait-outline',
      title: t('habits.common.noScreenBeforeBed.title'),
      description: t('habits.common.noScreenBeforeBed.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.1hour'),
      points: 20,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'morning-exercise',
      icon: 'fitness-outline',
      title: t('habits.common.morningExercise.title'),
      description: t('habits.common.morningExercise.description'),
      category: t('categories.fitness'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.20min'),
      points: 25,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'eat-fruit',
      icon: 'nutrition-outline',
      title: t('habits.common.eatFruit.title'),
      description: t('habits.common.eatFruit.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'practice-gratitude',
      icon: 'heart-outline',
      title: t('habits.common.practiceGratitude.title'),
      description: t('habits.common.practiceGratitude.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'pray',
      icon: 'heart-outline',
      title: t('habits.common.pray.title'),
      description: t('habits.common.pray.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'read-book',
      icon: 'book-outline',
      title: t('habits.common.readBook.title'),
      description: t('habits.common.readBook.description'),
      category: t('categories.learning'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.30min'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'breathing-exercises',
      icon: 'leaf-outline',
      title: t('habits.common.breathingExercises.title'),
      description: t('habits.common.breathingExercises.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'reduce-sugar',
      icon: 'fast-food-outline',
      title: t('habits.common.reduceSugar.title'),
      description: t('habits.common.reduceSugar.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.allDay'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'anxiety-journal',
      icon: 'journal-outline',
      title: t('habits.common.anxietyJournal.title'),
      description: t('habits.common.anxietyJournal.description'),
      category: t('categories.reflection'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'organize-space',
      icon: 'albums-outline',
      title: t('habits.common.organizeSpace.title'),
      description: t('habits.common.organizeSpace.description'),
      category: t('categories.productivity'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'take-breaks',
      icon: 'pause-outline',
      title: t('habits.common.takeBreaks.title'),
      description: t('habits.common.takeBreaks.description'),
      category: t('categories.productivity'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.5min'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    }
  ],

  "Anxiety Management": [
    {
      id: 'deep-breathing',
      icon: 'leaf-outline',
      title: t('habits.anxietyManagement.deepBreathing.title'),
      description: t('habits.anxietyManagement.deepBreathing.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'limit-caffeine',
      icon: 'cafe-outline',
      title: t('habits.anxietyManagement.limitCaffeine.title'),
      description: t('habits.anxietyManagement.limitCaffeine.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.afternoon'),
      points: 20,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    }
  ],

  "Depression Support": [
    {
      id: 'sunlight-exposure',
      icon: 'sunny-outline',
      title: t('habits.depressionSupport.sunlightExposure.title'),
      description: t('habits.depressionSupport.sunlightExposure.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.15min'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'social-connection',
      icon: 'people-outline',
      title: t('habits.depressionSupport.socialConnection.title'),
      description: t('habits.depressionSupport.socialConnection.description'),
      category: t('categories.social'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.10min'),
      points: 25,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    }
  ],

  "Sleep Issues": [
    {
      id: 'bedtime-routine',
      icon: 'bed-outline',
      title: t('habits.sleepIssues.bedtimeRoutine.title'),
      description: t('habits.sleepIssues.bedtimeRoutine.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.30min'),
      points: 20,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'bedroom-temperature',
      icon: 'thermometer-outline',
      title: t('habits.sleepIssues.bedroomTemperature.title'),
      description: t('habits.sleepIssues.bedroomTemperature.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.allNight'),
      points: 10,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    }
  ],

  "Stress Management": [
    {
      id: 'meditation',
      icon: 'flower-outline',
      title: t('habits.stressManagement.meditation.title'),
      description: t('habits.stressManagement.meditation.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.10min'),
      points: 20,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    },
    {
      id: 'nature-time',
      icon: 'leaf-outline',
      title: t('habits.stressManagement.natureTime.title'),
      description: t('habits.stressManagement.natureTime.description'),
      category: t('categories.lifestyle'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.20min'),
      points: 15,
      type: 'simple',
      frequency: FREQUENCY_TYPES.DAILY
    }
  ]
});


export const getRecommendedHabits = (userProfile,userHabits,t) => {
  const allHabits = getAvailableHabits(t);
  let recommendedHabits=[];

  const focusArea = userProfile?.focusArea || "General Wellness";

  switch(focusArea) {
    case "Anxiety Management":
      recommendedHabits = [
        ...allHabits["Anxiety Management"],
        ...allHabits.common.filter(habit => 
          habit.category === t('categories.mindfulness') || 
          habit.id === 'breathing-exercises' ||
          habit.id === 'anxiety-journal'
        )
      ];
      break;

    case "Stress Relief":
      recommendedHabits = [
        ...allHabits["Stress Management"], 
        ...allHabits.common.filter(habit => 
          habit.id === 'meditation' ||
          habit.id === 'organize-space' ||
          habit.id === 'take-breaks' ||
          habit.id === 'practice-gratitude'
        )
      ];
      break;

     case "Maintaining Balance":
      recommendedHabits = [
        ...allHabits.common.filter(habit => 
          habit.id === 'morning-exercise' ||
          habit.id === 'read-book' ||
          habit.id === 'practice-gratitude' ||
          habit.id === 'no-screen-before-bed'
        )
      ];
      break;

    case "General Wellness":
    default:
      recommendedHabits = [
        ...allHabits.common.filter(habit => 
          habit.id === 'water-intake' ||
          habit.id === 'morning-exercise' ||
          habit.id === 'eat-fruit' ||
          habit.id === 'practice-gratitude'
        )
      ];
      break;
  }
  const userHabitIds = userHabits.map(h => h.id);
  return recommendedHabits
    .filter(habit => !userHabitIds.includes(habit.id))
    .slice(0, 4); 
}