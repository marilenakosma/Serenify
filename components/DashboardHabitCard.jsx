import { useState,useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet,Animated} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import HabitProgressRing from './HabitProgressRing';
import { 
  isHabitCompleteForPeriod, 
  getCompletionsThisWeek, 
  getRequiredCompletionsPerWeek 
} from '../constants/habitFrequency';

const DashboardHabitCard = ({ habit, completions, onPress,onToggleCompletion }) => {
  const habitCompletions = completions[habit.id] || {};
  
  const today = new Date().toISOString().split('T')[0];
  const isComplete = Boolean(habitCompletions[today]); 
  
  
  const weeklyCompletions = getCompletionsThisWeek(habitCompletions);
  const requiredPerWeek = getRequiredCompletionsPerWeek(habit.frequency);
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const [checkmarkAnim] = useState(new Animated.Value(isComplete ? 1 : 0));
  const [cardColorAnim] = useState(new Animated.Value(isComplete ? 1 : 0));
  
  // Calculate progress based on frequency type
  let progress = 0;
  let progressText = '';
  
  if (habit.frequency === 'Everyday' || habit.frequency === 'Weekdays only' || habit.frequency === 'Weekends only') {
    progress = isComplete ? 1 : 0;
    progressText = isComplete ? 'Done today!' : 'Tap to complete';
  } else {
    progress = requiredPerWeek > 0 ? Math.min(weeklyCompletions / requiredPerWeek, 1) : 0;
    progressText = `${weeklyCompletions}/${requiredPerWeek} this week`;
    
    if (weeklyCompletions >= requiredPerWeek) {
      progressText = 'Week complete! 🎉';
    }
  }

  useEffect(() => {
  
  const targetValue = isComplete ? 1 : 0;
  
  // Force the animated values to the target value
  Animated.timing(cardColorAnim, {
    toValue: targetValue,
    duration: 300,
    useNativeDriver: false,
  }).start();

  if (isComplete) {
    Animated.spring(checkmarkAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(checkmarkAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
}, [isComplete, cardColorAnim, checkmarkAnim]);

   const handleQuickComplete = (e) => {
  e.stopPropagation();
  

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

  console.log(`Habit ${habit.id}: 
    isComplete = ${isComplete}, 
    cardColorAnim = ${cardColorAnim._value}`);

  return (
    <Animated.View style={[
    styles.habitCard,
    { 
      backgroundColor: cardBackgroundColor,
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
          name={habit.name} 
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
                color={isComplete ? "#4CAF50" : "#FF9800"}
              />
            </Animated.View>
            

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
          </View>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.habitTitle} numberOfLines={2}>
        {habit.text}
      </ThemedText>
      
      <ThemedText style={styles.habitProgress}>
        {progressText}
      </ThemedText>
      
      <View style={styles.streakContainer}>
        <ThemedText style={styles.streakNumber}>
          {habit.streak || 0}
        </ThemedText>
        <ThemedText style={styles.streakLabel}>
          {habit.frequency === 'Everyday' || habit.frequency === 'Weekdays only' || habit.frequency === 'Weekends only' ? 'days' : 'weeks'}
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
    fontWeight: '600',
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
});

export default DashboardHabitCard;