

export const getAvailableHabits = (t) => ({
  // Common habits everyone might want
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
      increment: 250
    },
    {
      id: 'no-screen-before-bed',
      icon: 'phone-portrait-outline',
      title: t('habits.common.noScreenBeforeBed.title'),
      description: t('habits.common.noScreenBeforeBed.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.1hour'),
      points: 20
    },
    {
      id: 'morning-exercise',
      icon: 'fitness-outline',
      title: t('habits.common.morningExercise.title'),
      description: t('habits.common.morningExercise.description'),
      category: t('categories.fitness'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.20min'),
      points: 25
    },
    {
      id: 'eat-fruit',
      icon: 'nutrition-outline',
      title: t('habits.common.eatFruit.title'),
      description: t('habits.common.eatFruit.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10
    },
    {
      id: 'practice-gratitude',
      icon: 'heart-outline',
      title: t('habits.common.practiceGratitude.title'),
      description: t('habits.common.practiceGratitude.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10
    },
    {
      id: 'pray',
      icon: 'heart-outline',
      title: t('habits.common.pray.title'),
      description: t('habits.common.pray.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10
    },
    {
      id: 'read-book',
      icon: 'book-outline',
      title: t('habits.common.readBook.title'),
      description: t('habits.common.readBook.description'),
      category: t('categories.learning'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.30min'),
      points: 15
    },
    {
      id: 'breathing-exercises',
      icon: 'leaf-outline',
      title: t('habits.common.breathingExercises.title'),
      description: t('habits.common.breathingExercises.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 15
    },
    {
      id: 'reduce-sugar',
      icon: 'fast-food-outline',
      title: t('habits.common.reduceSugar.title'),
      description: t('habits.common.reduceSugar.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.allDay'),
      points: 15
    },
    {
      id: 'anxiety-journal',
      icon: 'journal-outline',
      title: t('habits.common.anxietyJournal.title'),
      description: t('habits.common.anxietyJournal.description'),
      category: t('categories.reflection'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10
    },
    {
      id: 'organize-space',
      icon: 'albums-outline',
      title: t('habits.common.organizeSpace.title'),
      description: t('habits.common.organizeSpace.description'),
      category: t('categories.productivity'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 10
    },
    {
      id: 'take-breaks',
      icon: 'pause-outline',
      title: t('habits.common.takeBreaks.title'),
      description: t('habits.common.takeBreaks.description'),
      category: t('categories.productivity'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.5min'),
      points: 10
    }
  ],

  "Anxiety Management": [
    {
      id: 'deep-breathing',
      icon: 'leaf-outline',
      title:  t('habits.anxietyManagement.deepBreathing.title'),
      description: t('habits.anxietyManagement.deepBreathing.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.5min'),
      points: 15
    },
    {
      id: 'limit-caffeine',
      icon: 'cafe-outline',
      title:  t('habits.anxietyManagement.limitCaffeine.title'),
      description: t('habits.anxietyManagement.limitCaffeine.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.afternoon'),
      points: 20
    }
  ],

  "Depression Support": [
    {
      id: 'sunlight-exposure',
      icon: 'sunny-outline',
      title: t('habits.anxietyManagement.sunlightExposure.title'),
      description: t('habits.anxietyManagement.sunlightExposure.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.15min'),
      points: 15
    },
    {
      id: 'social-connection',
      icon: 'people-outline',
      title: t('habits.anxietyManagement.socialConnection.title'),
      description: t('habits.anxietyManagement.socialConnection.description'),
      category: t('categories.social'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.10min'),
      points: 25
    }
  ],

  "Sleep Issues": [
    {
      id: 'bedtime-routine',
      icon: 'bed-outline',
      title: t('habits.anxietyManagement.bedtimeRoutine.title'),
      description: t('habits.anxietyManagement.bedtimeRoutine.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.30min'),
      points: 20
    },
    {
      id: 'bedroom-temperature',
      icon: 'thermometer-outline',
      title: t('habits.anxietyManagement.bedroomTemperature.title'),
      description: t('habits.anxietyManagement.bedroomTemperature.description'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('difficulties.allNight'),
      points: 10
    }
  ],

  "Stress Management": [
    {
      id: 'meditation',
      icon: 'flower-outline',
      title: t('habits.anxietyManagement.meditation.title'),
      description: t('habits.anxietyManagement.meditation.description'),
      category: t('categories.mindfulness'),
      difficulty: t('difficulties.medium'),
      duration: t('difficulties.10min'),
      points: 20
    },
    {
      id: 'nature-time',
      icon: 'leaf-outline',
      title: t('habits.anxietyManagement.natureTime.title'),
      description: t('habits.anxietyManagement.natureTime.description'),
      category: t('categories.lifestyle'),
      difficulty: t('difficulties.easy'),
      duration: t('difficulties.20min'),
      points: 15
    }
  ]

});