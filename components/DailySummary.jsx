import { View, StyleSheet } from 'react-native';
import ThemedText from './ThemedText';
import HabitProgressRing from './HabitProgressRing';
import { useTranslation } from '../constants/translations';

import { 
  isHabitCompleteForPeriod,
  getCompletionsThisWeek,
  getRequiredCompletionsPerWeek 
} from '../constants/habitFrequency';

const DailySummary = ({ habits, habitCompletions }) => {
  const { t } = useTranslation(); 

  // Calculate today's completion stats
  const todayStats = habits.reduce((acc, habit) => {
    const completions = habitCompletions[habit.id] || {};
    const isComplete = isHabitCompleteForPeriod(habit.frequency, completions);
    
    acc.total++;
    if (isComplete) acc.completed++;
    
    return acc;
  }, { completed: 0, total: 0 });

  // Calculate weekly progress
  const weeklyStats = habits.reduce((acc, habit) => {
    const completions = habitCompletions[habit.id] || {};
    const weeklyCompletions = getCompletionsThisWeek(completions);
    const requiredPerWeek = getRequiredCompletionsPerWeek(habit.frequency);
    
    if (requiredPerWeek > 1 && requiredPerWeek < 7) { // Only count weekly habits
      acc.completed += weeklyCompletions;
      acc.total += requiredPerWeek;
    }
    
    return acc;
  }, { completed: 0, total: 0 });

  const todayProgress = todayStats.total > 0 ? todayStats.completed / todayStats.total : 0;
  const weeklyProgress = weeklyStats.total > 0 ? Math.min(weeklyStats.completed / weeklyStats.total, 1) : 0;

  return (
    <View style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        {t('dailySummary.todaysProgress')}
      </ThemedText>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <HabitProgressRing 
            progress={todayProgress}
            size={80}
            strokeWidth={8}
            color="#4CAF50"
          />
          <ThemedText title={true} style={styles.progressLabel}>
            {t('dailySummary.dailyGoals')}
          </ThemedText>
          <ThemedText style={styles.progressSubtext}>
            {t('dailySummary.complete', { 
              completed: todayStats.completed, 
              total: todayStats.total 
            })}
          </ThemedText>
        </View>
        
        {weeklyStats.total > 0 && (
          <View style={styles.progressItem}>
            <HabitProgressRing 
              progress={weeklyProgress}
              size={80}
              strokeWidth={8}
              color="#FF9800"
            />
            <ThemedText title={true} style={styles.progressLabel}>
              {t('dailySummary.weeklyGoals')}
            </ThemedText>
            <ThemedText style={styles.progressSubtext}>
              {t('dailySummary.thisWeek', { 
                completed: weeklyStats.completed, 
                total: weeklyStats.total 
              })}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 12,
    textAlign: 'center',
  },
  progressSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DailySummary;