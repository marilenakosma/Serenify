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

const quests = () => {
  const { user,userHabits,toggleHabitCompletion,getHabitCompletion } = useAuthStore();
  const [completedQuests, setCompletedQuests] = useState(new Set());
  const router = useRouter()

  const focusArea = user?.focusArea || 'General Wellness';

  const defaultGoals = [
    { id: 'complete-goal', name: 'checkmark-outline', text: 'Complete a daily goal', category: 'Foundation', points: 10, duration: '5 min' },
    { id: 'reflection', name: 'journal-outline', text: 'Write a reflection', category: 'Foundation', points: 15, duration: '10 min' },
    { id: 'affirmation', name: 'heart-outline', text: 'Practice positive affirmations', category: 'Foundation', points: 10, duration: '5 min' },
    { id: 'exercise', name: 'fitness-outline', text: 'Do some form of exercise', category: 'Foundation', points: 20, duration: '20 min' },
  ];

  // Combine goals properly
  const allGoals = [...defaultGoals, ...userHabits];
  const goalsByCategory = groupGoalsByCategory(allGoals);

   const handleToggleQuest = (questId) => {
    // Check if it's a user habit or default goal
    const isUserHabit = userHabits.some(habit => habit.id === questId);
    
    if (isUserHabit) {
      //  Use store method for habits
      toggleHabitCompletion(questId);
    } else {
      // Handle default goals locally for now
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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{ backgroundColor: '#f1f5eeff' }} />
        
        <ThemedText title={true} style={styles.title}>
          Habits
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
                My Habits
              </ThemedText>
              <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
                <ThemedText style={styles.addButtonText}>Add New</ThemedText>
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Show real user habits or empty state */}
            {userHabits.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.habitCardsContainer}
              >
                {userHabits.map((habit) => (
                  <TouchableOpacity 
                    key={habit.id} 
                    style={styles.habitCard}
                    onPress={() => handleStatsPress(habit.id)}
                  >
                    <Ionicons name={habit.name} size={32} color="#4CAF50" />
                    <View style={styles.streakRow}>
                      <ThemedText title={true} style={styles.habitStreak}>
                        {habit.streak || 0}
                      </ThemedText>
                      <ThemedText style={styles.habitStreakLabel}>Days</ThemedText>
                    </View>
                    <ThemedText style={styles.habitTitle}>{habit.text}</ThemedText>
                    <ThemedText style={styles.habitFrequency}>{habit.frequency}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyHabitsContainer}>
                <ThemedText style={styles.emptyHabitsText}>
                  No habits yet! Tap "Add New" to get started 🌱
                </ThemedText>
              </View>
            )}
          </View>

          {/* Categories with Goals */}
          {Object.entries(goalsByCategory).map(([categoryName, categoryGoals]) => {
            if (categoryGoals.length === 0) return null;

            return (
              <View key={categoryName} style={styles.categorySection}>
                <ThemedText title={true} style={styles.categoryTitle}>
                  {categoryName}
                </ThemedText>

                {categoryGoals.map((goal, index) => {
                  //  Check completion correctly
                  const isUserHabit = userHabits.some(habit => habit.id === goal.id);
                  const isCompleted = isUserHabit 
                    ? getHabitCompletion(goal.id) 
                    : completedQuests.has(goal.id);

                  return (
                    <View key={goal.id}>
                      <ThemedGoal
                        name={goal.name || goal.icon}
                        text={goal.text || goal.title}
                        points={goal.points}
                        category={goal.category}
                        duration={goal.duration || goal.defaultDuration}
                        completed={isCompleted}
                        onToggle={() => handleToggleQuest(goal.id)}
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

export default quests;

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
  
  // Habit Cards
  habitCardsContainer: {
    paddingRight: 10,
  },
  habitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // Aligns text baselines nicely
    marginTop: 8,
    marginBottom: 8,
  },
  habitStreak: {
    fontSize: 24,
    color: '#2c3e50',
    marginRight:4,
  },
  habitStreakLabel: {
    fontSize: 12,
    color: '#666',
  },
  habitTitle: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  habitFrequency: {
    fontSize: 12,
    color: '#666',
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
  // 
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
});