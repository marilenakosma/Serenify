export const availableHabits = {
  // Common habits everyone might want
  common: [
    {
      id: 'water-intake',
      icon: 'water-outline',
      title: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day',
      category: 'Health',
      difficulty: 'Easy'
    },
    {
      id: 'no-screen-before-bed',
      icon: 'phone-portrait-outline',
      title: 'No screens 1 hour before bed',
      description: 'Better sleep quality',
      category: 'Sleep',
      difficulty: 'Medium'
    },
    {
      id: 'morning-exercise',
      icon: 'fitness-outline',
      title: 'Morning exercise',
      description: '20 minutes of physical activity',
      category: 'Fitness',
      difficulty: 'Medium'
    },
    {
      id: 'eat-fruit',
      icon: 'nutrition-outline',
      title: 'Eat 2 servings of fruit',
      description: 'Daily fruit intake',
      category: 'Nutrition',
      difficulty: 'Easy'
    },
    {
      id: 'practice-gratitude',
      icon: 'heart-outline',
      title: 'Practice gratitude',
      description: 'Write 3 things you\'re grateful for',
      category: 'Mindfulness',
      difficulty: 'Easy'
    },
    {
      id: 'read-book',
      icon: 'book-outline',
      title: 'Read for 30 minutes',
      description: 'Daily reading habit',
      category: 'Learning',
      difficulty: 'Medium'
    }
  ],

  // Personalized habits based on focus area
  "Anxiety Management": [
    {
      id: 'breathing-exercises',
      icon: 'leaf-outline',
      title: 'Deep breathing exercises',
      description: '5-minute breathing routine',
      category: 'Mindfulness',
      difficulty: 'Easy'
    },
    {
      id: 'limit-caffeine',
      icon: 'cafe-outline',
      title: 'Limit caffeine after 2 PM',
      description: 'Reduce anxiety triggers',
      category: 'Health',
      difficulty: 'Medium'
    },
    {
      id: 'anxiety-journal',
      icon: 'journal-outline',
      title: 'Write down worries',
      description: 'Process anxious thoughts',
      category: 'Reflection',
      difficulty: 'Easy'
    }
  ],

  "Stress Relief": [
    {
      id: 'organize-space',
      icon: 'albums-outline',
      title: 'Organize one small area',
      description: 'Declutter for mental clarity',
      category: 'Productivity',
      difficulty: 'Easy'
    },
    {
      id: 'take-breaks',
      icon: 'pause-outline',
      title: 'Take 5-minute breaks every hour',
      description: 'Prevent overwhelm',
      category: 'Productivity',
      difficulty: 'Medium'
    }
  ],

  // ... other focus areas
};