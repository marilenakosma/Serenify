import { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import HabitProgressRing from './HabitProgressRing';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../constants/translations';
import { 
  isHabitCompleteForPeriod, 
  getCompletionsThisWeek, 
  getRequiredCompletionsPerWeek 
} from '../constants/habitFrequency';

const DashboardHabitCard = ({ habit, onPress, onToggleCompletion }) => {
  const { habitCompletions } = useAuthStore();
  const { t } = useTranslation(); 
  const thisHabitCompletions = habitCompletions[habit.id] || {};
  
  const today = new Date().toISOString().split('T')[0];
  const todayCompletion = thisHabitCompletions[today];
  let isComplete, progress, progressText;

  const weeklyCompletions = getCompletionsThisWeek(thisHabitCompletions);
  const requiredPerWeek = getRequiredCompletionsPerWeek(habit.frequency);

  
  const getHabitIcon = () => {

  if (habit.icon && typeof habit.icon === 'string' && habit.icon.includes('-')) {
    return habit.icon;
  }

  if (habit.name && typeof habit.name === 'string' && habit.name.includes('-')) {
    return habit.name;
  }
  const fallbackIcons = {
    'water-intake': 'water-outline',
    'meditation': 'leaf-outline',
    'exercise': 'fitness-outline',
    'gratitude': 'heart-outline'
  };
  
  return fallbackIcons[habit.id] || 'checkmark-outline';
};

  const getHabitText = () => {

  const text = habit.text || habit.title;
  if (text && !text.includes('-') && text.length > 2) {
    return text;
  }
  return habit.id || 'Habit';
};

  if (habit.type === "incremental") {
    const todayAmount = thisHabitCompletions[today] || 0;
    const target = habit.target || 2000;

    progress = Math.min(todayAmount / target, 1);
    isComplete = todayAmount >= target;
    progressText = `${todayAmount}/${target} ${habit.unit}`;

    if (isComplete) {
      progressText += ' ✅';
    }
  } else if (habit.frequency === 'daily' || habit.frequency === 'weekdays' || habit.frequency === 'weekends') {
    isComplete = Boolean(thisHabitCompletions[today]);
    progress = isComplete ? 1 : 0;
    progressText = isComplete ? t('habitCard.doneToday') : t('habitCard.tapToComplete');
  } else {
    // Weekly habits logic (3x/week, etc.)
    const todayCompleted = Boolean(thisHabitCompletions[today]);
    const canCompleteMore = weeklyCompletions < requiredPerWeek;
    
    // For animation purposes, use today's completion
    isComplete = todayCompleted;
    
    // For progress calculation, use weekly progress
    progress = requiredPerWeek > 0 ? Math.min(weeklyCompletions / requiredPerWeek, 1) : 0;
    
    if (weeklyCompletions >= requiredPerWeek) {
      progressText = t('habitCard.weekComplete');
    } else if (todayCompleted) {
      progressText = t('habitCard.weeklyProgressDoneToday', {
        completed: weeklyCompletions,
        required: requiredPerWeek
      });
    } else if (canCompleteMore) {
      progressText = t('habitCard.weeklyProgressTapToComplete', {
        completed: weeklyCompletions,
        required: requiredPerWeek
      });
    } else {
      progressText = t('habitCard.weeklyProgress', {
        completed: weeklyCompletions,
        required: requiredPerWeek
      });
    }
  }
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const [checkmarkAnim] = useState(() => new Animated.Value(0));
  const [cardColorAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const targetValue = isComplete ? 1 : 0;
    
    // Force the animated values to the target value
    const cardAnimation = Animated.timing(cardColorAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: false,
    });

    const checkmarkAnimation = isComplete 
      ? Animated.spring(checkmarkAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      : Animated.timing(checkmarkAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        });

    cardAnimation.start();
    checkmarkAnimation.start();

    // Cleanup function
    return () => {
      cardAnimation.stop();
      checkmarkAnimation.stop();
    };
  }, [isComplete]);

  const handleQuickComplete = (e) => {
    e.stopPropagation();

    if (habit.type === 'incremental') {
      onPress();
      return;
    }
    const todayCompleted = Boolean(thisHabitCompletions[today]);
    
    if (!isComplete) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
    
    onToggleCompletion(habit.id);
  };

  const cardBackgroundColor = cardColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#E8F5E8'] // White to light green
  });

  const cardBorderColor = cardColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#4CAF50'] // Transparent to green border
  });

  return (
    <Animated.View style={[
      styles.habitCard,
      { 
        backgroundColor: 'white',
        borderColor: cardBorderColor,
        borderWidth: 2,
      }
    ]}>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <View style={styles.habitHeader}>
          <Ionicons 
            name={getHabitIcon()} 
            size={24} 
            color={isComplete ? "#4CAF50" : "#666"} 
          />
          <TouchableOpacity onPress={handleQuickComplete} activeOpacity={0.8}>
            <View style={{ position: 'relative' }}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <HabitProgressRing 
                  progress={progress}
                  size={45}
                  strokeWidth={4}
                  color={isComplete ? "#4CAF50" : '#2196F3'}
                />
              </Animated.View>
              
              {habit.type === 'incremental' ? (
                <View style={[styles.incrementIcon]}>
                  <Ionicons name="add" size={16} color='#2196F3' />
                </View>
              ) : (
                <Animated.View style={[
                  styles.checkmarkOverlay,
                  {
                    transform: [
                      { scale: checkmarkAnim },
                      { rotate: checkmarkAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })}
                    ],
                    opacity: checkmarkAnim
                  }
                ]}>
                  <Ionicons name="checkmark" size={20} color="white" />
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      
        <ThemedText style={styles.habitTitle} numberOfLines={2}>
          {getHabitText()}
        </ThemedText>
      
        <ThemedText style={[
          styles.habitProgress,
          { color: habit.type === 'incremental' ? '#FF9800' : '#4CAF50' }
        ]}>
          {progressText}
        </ThemedText>
      
        <View style={styles.streakContainer}>
          <ThemedText style={styles.streakNumber}>
            {habit.streak || 0}
          </ThemedText>
          <ThemedText style={styles.streakLabel}>
              {habit.streak === 1 && (habit.frequency === 'daily' || habit.frequency === 'weekdays' || habit.frequency === 'weekends')
              ? t('habitCard.day')
              : habit.frequency === 'daily' || habit.frequency === 'weekdays' || habit.frequency === 'weekends'
              ? t('habitCard.days')
              : habit.streak === 1
              ? t('habitCard.week')
              : t('habitCard.weeks')}
        </ThemedText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    //backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 140,
    minHeight: 160,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitTitle: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 18,
  },
  habitProgress: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  streakLabel: {
    fontSize: 11,
    color: '#666',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default DashboardHabitCard;