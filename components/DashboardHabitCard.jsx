import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import HabitProgressRing from './HabitProgressRing';
import { 
  isHabitCompleteForPeriod, 
  getCompletionsThisWeek, 
  getRequiredCompletionsPerWeek 
} from '../constants/habitFrequency';

const DashboardHabitCard = ({ habit, completions, onPress }) => {
  const habitCompletions = completions[habit.id] || {};
  const isComplete = isHabitCompleteForPeriod(habit.frequency, habitCompletions);
  const weeklyCompletions = getCompletionsThisWeek(habitCompletions);
  const requiredPerWeek = getRequiredCompletionsPerWeek(habit.frequency);
  
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

  return (
    <TouchableOpacity 
      style={styles.habitCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.habitHeader}>
        <Ionicons 
          name={habit.name} 
          size={24} 
          color={isComplete ? "#4CAF50" : "#666"} 
        />
        <HabitProgressRing 
          progress={progress}
          size={45}
          strokeWidth={4}
          color={isComplete ? "#4CAF50" : "#FF9800"}
        />
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
  );
};

const styles = StyleSheet.create({
  habitCard: {
    backgroundColor: 'white',
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
});

export default DashboardHabitCard;