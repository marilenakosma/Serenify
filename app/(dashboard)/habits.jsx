import { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../../components/Spacer";
import BackButton from "../../components/BackButton";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { 
  isHabitCompleteForPeriod, 
  getCompletionsThisWeek, 
  getRequiredCompletionsPerWeek,
  getFrequencyDisplay 
} from "../../constants/habitFrequency.js";
import { useTranslation } from '../../constants/translations';
import { getFoundationalHabits } from "../../constants/foundationalHabits"
const habits = () => {
  const { 
    user,
    userHabits,
    toggleHabitCompletion,
    habitCompletions,
    getHabitCompletion,
    addHabits
  } = useAuthStore();

  const [completedQuests, setCompletedQuests] = useState(new Set());
  const router = useRouter();
  const { t } = useTranslation();

  const focusArea = user?.focusArea || 'General Wellness';
  
  const defaultGoals = getFoundationalHabits(t);
  
  const availableFoundationalGoals = defaultGoals.filter(goal => 
    !userHabits.some(habit => habit.id === goal.id)
  );
  const allGoals = [...availableFoundationalGoals, ...userHabits];
  const goalsByCategory = groupGoalsByCategory(allGoals);

  // Handle adding foundational goal as trackable habit
  const handleAddFoundationalGoal = async (goal) => {
    try {
      console.log('Adding foundational goal as habit:', goal.title);
      
      const newHabit = {
        ...goal,
        text: goal.title, 
        createdAt: new Date().toISOString(),
        isActive: true,
        streak: 0,
        lastCompleted: null
      };

      const result = await addHabits(newHabit);
      
      if (result.success) {
        console.log('Foundational goal added as habit');
        // Remove from local completed state since it's now a real habit
        setCompletedQuests(prev => {
          const newSet = new Set(prev);
          newSet.delete(goal.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error adding foundational goal:', error);
    }
  };

  const handleToggleQuest = (questId) => {
    // Check if it's a user habit or foundational goal
    const isUserHabit = userHabits.some(habit => habit.id === questId);
    const foundationalGoal = availableFoundationalGoals.find(goal => goal.id === questId);
    
    if (isUserHabit) {
      // Use store method for habits
      toggleHabitCompletion(questId);
    } else if (foundationalGoal) {
      // For foundational goals, offer to add as trackable habit
      handleAddFoundationalGoal(foundationalGoal);
    } else {
      // Handle other goals locally
      setCompletedQuests(prev => {
        const newSet = new Set(prev);
        if (newSet.has(questId)) {
          newSet.delete(questId);
        } else {
          newSet.add(questId);
        }
        return newSet;
      });
    }
  };

 const handleStatsPress = (habitId) => {
    router.push({
    pathname: '/(modals)/habit-stats',
    params: { habitId }
  });
  };

 const handleAddHabit = () => {
  router.push('/(modals)/add-habits');
};

const getHabitStatus = (habit) => {
    const completions = habitCompletions[habit.id] || {};
    const isComplete = isHabitCompleteForPeriod(habit.frequency, completions);
    const weeklyCompletions = getCompletionsThisWeek(completions);
    const requiredPerWeek = getRequiredCompletionsPerWeek(habit.frequency);
    
    return {
      isComplete,
      weeklyCompletions,
      requiredPerWeek,
      progress: requiredPerWeek > 0 ? weeklyCompletions / requiredPerWeek : 0,
      isExceeding: weeklyCompletions > requiredPerWeek
    };
  };

    const getHabitIcon = (habit) => {
      if (habit.icon && typeof habit.icon === 'string' && habit.icon.includes('-')) {
        return habit.icon;  
      }
      if (habit.icon && typeof habit.icon === 'string' && habit.icon.includes('-')) {
        return habit.icon;  
      }

      const fallbackIcons = {
      'complete-goal': 'checkmark-outline',
      'reflection': 'journal-outline',
      'affirmation': 'heart-outline',
      'exercise': 'fitness-outline',
      'water-intake': 'water-outline',
      'meditation': 'leaf-outline'
      };
      return fallbackIcons[habit.id] || 'checkmark-outline';  // Fallback
    };

    const getHabitText = (habit) => {

        return habit.text || habit.title || habit.icon || 'Habit';
      };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{ backgroundColor: '#f1f5eeff' }} />
        
        <ThemedText title={true} style={styles.title}>
          {t('habits.title')}
        </ThemedText>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Habits Overview */}
          <View style={styles.habitsOverview}>
            <View style={styles.overviewHeader}>
              <ThemedText title={true} style={styles.overviewTitle}>
                {t('habits.myHabits')}
              </ThemedText>
              <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
                <ThemedText style={styles.addButtonText}>{t('habits.addNewHabits')}</ThemedText>
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Show real user habits or empty state */}
            {userHabits.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.habitsScrollContent}
                style={styles.habitsScroll}
              >
                {userHabits.map((habit) => {
                  const status = getHabitStatus(habit);
                  
                  return (
                    <TouchableOpacity 
                      key={habit.id} 
                      style={[
                        styles.habitCard,
                        status.isComplete && styles.completedHabitCard
                      ]}
                      onPress={() => handleStatsPress(habit.id)}
                    >
                      {/* Completion status indicator */}
                      <View style={[
                        styles.statusIndicator,
                        status.isComplete ? styles.completeIndicator : styles.pendingIndicator
                      ]}>
                        <Ionicons 
                          name={status.isComplete ? "checkmark-circle" : "time-outline"} 
                          size={16} 
                          color="#fff" 
                        />
                      </View>

                      <Ionicons 
                        name={getHabitIcon(habit)} 
                        size={32} 
                        color={status.isComplete ? "#4CAF50" : "#666"} 
                      />
                      
                      <View style={styles.streakRow}>
                        <ThemedText title={true} style={styles.habitStreak}>
                          {habit.streak || 0}
                        </ThemedText>
                       <ThemedText style={styles.habitStreakLabel}>
                         {/* Show correct unit based on frequency type */}
                        {habit.frequency === 'Everyday' || habit.frequency === 'Weekdays only' || habit.frequency === 'Weekends only' 
                         ? t('habitCard.days')  : t('habitCard.weeks')}
                       </ThemedText>
                      </View>
                      
                      <ThemedText style={styles.habitTitle}>{getHabitText(habit)}</ThemedText>
                      
                      <ThemedText style={styles.habitFrequency}>
                        {getFrequencyDisplay(habit.frequency, t)}
                      </ThemedText>

                      {/*  Frequency-aware progress text */}
                      {status.requiredPerWeek > 1 && (
                        <ThemedText style={styles.weeklyProgress}>
                          {t('habitCard.weeklyProgress', {
                            completed: status.weeklyCompletions,
                            required: status.requiredPerWeek
                          })} 
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.emptyHabitsContainer}>
                <ThemedText style={styles.emptyHabitsText}>
                 {t('habits.description')} 🌱
                </ThemedText>
              </View>
            )}
          </View>

          {/* Categories with Goals */}
          {Object.entries(goalsByCategory).map(([categoryicon, categoryGoals]) => {
            if (categoryGoals.length === 0) return null;

            return (
              <View key={categoryicon} style={styles.categorySection}>
                <ThemedText title={true} style={styles.categoryTitle}>
                  {categoryicon}
                </ThemedText>

                {categoryGoals.map((goal, index) => {
                  //  Check completion correctly
                  const isUserHabit = userHabits.some(habit => habit.id === goal.id);

                  const isFoundationalGoal = availableFoundationalGoals.some(g => g.id === goal.id);

                  const isCompleted = isUserHabit 
                    ? getHabitCompletion(goal.id) 
                    : completedQuests.has(goal.id);
                
                  return (

                    
                    <View key={goal.id}>
                      <ThemedGoal
                        icon={goal.icon}
                        text={goal.title}
                        points={goal.points}
                        category={goal.category}
                        duration={goal.duration || goal.defaultDuration}
                        completed={isCompleted}
                        onToggle={() => handleToggleQuest(goal.id)}
                        isRecommendation={isFoundationalGoal}
                      />
                      {index < categoryGoals.length - 1 && <Spacer height={12} />}
                    </View>
                  );
                })}

                <Spacer height={25} />
              </View>
            );
          })}

          <Spacer height={30} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

// Helper function to group goals
const groupGoalsByCategory = (goals) => {
  return goals.reduce((groups, goal) => {
    const category = goal.category || 'Foundation';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(goal);
    return groups;
  }, {});
};

export default habits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  
  // Habits Overview Section
  habitsOverview: {
    marginBottom: 30,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 20,
    color: '#2c3e50',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },

  habitsScroll: {
    marginBottom: 20,
  },
  habitsScrollContent: {
    paddingHorizontal: 0,
    gap: 16,
  },

  habitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 140, 
    minHeight: 160, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  
  
  streakRow: {
    alignItems: 'center',
    marginVertical: 12,
    flexDirection: 'row',
    gap:7,
    alignItems: 'baseline',
  },
  
  habitStreak: {
    fontSize: 24,
    color: '#2c3e50',
  },
  
  habitStreakLabel: {
    fontSize: 12,
    color: '#666',
  },
  
  habitTitle: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  
  habitFrequency: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },

  weeklyProgress: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Category Section
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    color: '#2c3e50',
    marginBottom: 15,
  },
  
  // Empty state
  emptyHabitsContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  emptyHabitsText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 16,
  },
  
  // Completion states
  completedHabitCard: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  
  //  Status indicator 
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  completeIndicator: {
    backgroundColor: '#4CAF50',
  },
  
  pendingIndicator: {
    backgroundColor: '#FF9800',
  },
});