

export const availableHabits = {
  // Common habits everyone might want
 common: [
    {
      id: 'water-intake',
      icon: 'water-outline',
      title: 'Drink more water',
      description: 'Stay hydrated throughout the day',
      category: 'Health',
      difficulty: 'Easy',
      duration: 'All day',
      points: 15,
      type:'incremental',
      target:2000,
      unit:'ml',
      increment:250
    },
    {
      id: 'no-screen-before-bed',
      icon: 'phone-portrait-outline',
      title: 'No screens 1 hour before bed',
      description: 'Improve sleep quality by avoiding blue light',
      category: 'Health',
      difficulty: 'Medium',
      duration: '1 hour',
      points: 20
    },
    {
      id: 'morning-exercise',
      icon: 'fitness-outline',
      title: 'Morning exercise',
      description: '20 minutes of physical activity',
      category: 'Fitness',
      difficulty: 'Medium',
      duration: '20 min',
      points: 25
    },
    {
      id: 'eat-fruit',
      icon: 'nutrition-outline',
      title: 'Eat 2 servings of fruit',
      description: 'Daily fruit intake for vitamins',
      category: 'Health',
      difficulty: 'Easy',
      duration: '5 min',
      points: 10
    },
    {
      id: 'practice-gratitude',
      icon: 'heart-outline',
      title: 'Practice gratitude',
      description: 'Write 3 things you\'re grateful for',
      category: 'Mindfulness',
      difficulty: 'Easy',
      duration: '5 min',
      points: 10
    },
    {
      id: 'pray',
      icon: 'heart-outline',
      title: 'Pray',
      description: 'Prayer can help bring calm',
      category: 'Mindfulness',
      difficulty: 'Easy',
      duration: '5 min',
      points: 10
    },
    {
      id: 'read-book',
      icon: 'book-outline',
      title: 'Read for 30 minutes',
      description: 'Daily reading habit for learning',
      category: 'Learning',
      difficulty: 'Medium',
      duration: '30 min',
      points: 15
    },
    {
      id: 'breathing-exercises',
      icon: 'leaf-outline',
      title: 'Deep breathing exercises',
      description: '5-minute breathing routine for calm',
      category: 'Mindfulness',
      difficulty: 'Easy',
      duration: '5 min',
      points: 15
    },
    {
      id: 'reduce-sugar',
      icon: 'fast-food-outline',
      title: 'Reduce sugar',
      description: 'Improve your health',
      category: 'Health',
      difficulty: 'Medium',
      duration: 'All day',
      points: 15
    },
    {
      id: 'anxiety-journal',
      icon: 'journal-outline',
      title: 'Write down worries',
      description: 'Process anxious thoughts',
      category: 'Reflection',
      difficulty: 'Easy',
      duration: '5 min',
      points: 10
    },
    {
      id: 'organize-space',
      icon: 'albums-outline',
      title: 'Organize one small area',
      description: 'Declutter for mental clarity',
      category: 'Productivity',
      difficulty: 'Easy',
      duration: '5 min',
      points: 10
    },
    {
      id: 'take-breaks',
      icon: 'pause-outline',
      title: 'Take 5-minute breaks every hour',
      description: 'Prevent overwhelm',
      category: 'Productivity',
      difficulty: 'Medium',
      duration: '5 min',
      points: 10
    }
  ],

  "Anxiety Management": [
    {
      id: 'deep-breathing',
      icon: 'leaf-outline',
      title: 'Deep breathing exercise',
      description: '5-minute breathing routine to reduce anxiety',
      category: 'Mindfulness',
      difficulty: 'Easy',
      duration: '5 min',
      points: 15
    },
    {
      id: 'limit-caffeine',
      icon: 'cafe-outline',
      title: 'Limit caffeine after 2 PM',
      description: 'Reduce anxiety triggers by avoiding late caffeine',
      category: 'Health',
      difficulty: 'Medium',
      duration: 'Afternoon',
      points: 20
    }
  ],

  "Depression Support": [
    {
      id: 'sunlight-exposure',
      icon: 'sunny-outline',
      title: 'Get 15 minutes of sunlight',
      description: 'Natural light exposure to boost mood and energy',
      category: 'Health',
      difficulty: 'Easy',
      duration: '15 min',
      points: 15
    },
    {
      id: 'social-connection',
      icon: 'people-outline',
      title: 'Connect with a friend',
      description: 'Reach out to someone for social support',
      category: 'Social',
      difficulty: 'Medium',
      duration: '10 min',
      points: 25
    }
  ],

  "Sleep Issues": [
    {
      id: 'bedtime-routine',
      icon: 'bed-outline',
      title: 'Consistent bedtime routine',
      description: 'Same wind-down activities every night',
      category: 'Health',
      difficulty: 'Medium',
      duration: '30 min',
      points: 20
    },
    {
      id: 'bedroom-temperature',
      icon: 'thermometer-outline',
      title: 'Keep bedroom cool (65-68°F)',
      description: 'Optimal temperature for quality sleep',
      category: 'Health',
      difficulty: 'Easy',
      duration: 'All night',
      points: 10
    }
  ],

  "Stress Management": [
    {
      id: 'meditation',
      icon: 'flower-outline',
      title: '10-minute meditation',
      description: 'Daily mindfulness practice to reduce stress',
      category: 'Mindfulness',
      difficulty: 'Medium',
      duration: '10 min',
      points: 20
    },
    {
      id: 'nature-time',
      icon: 'leaf-outline',
      title: 'Spend time in nature',
      description: 'Connect with nature to lower stress levels',
      category: 'Lifestyle',
      difficulty: 'Easy',
      duration: '20 min',
      points: 15
    }
  ]

};