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

const quests = () => {
  const { user } = useAuthStore();
  const [completedQuests, setCompletedQuests] = useState(new Set());
  
  const focusArea = user?.focusArea || 'General Wellness';

  const defaultGoals = [
    { id: 'complete-goal', name: 'checkmark-outline', text: 'Complete a daily goal', category: 'Foundation', points: 10, duration: '5 min' },
    { id: 'reflection', name: 'journal-outline', text: 'Write a reflection', category: 'Foundation', points: 15, duration: '10 min' },
    { id: 'affirmation', name: 'heart-outline', text: 'Practice positive affirmations', category: 'Foundation', points: 10, duration: '5 min' },
    { id: 'exercise', name: 'fitness-outline', text: 'Do some form of exercise', category: 'Foundation', points: 20, duration: '20 min' },
  ];

  // Mock user habits 
  const userHabits = [
    { id: 'clean-room', name: 'home-outline', text: 'Clean Room', streak: 0, frequency: 'Everyday', category: 'Lifestyle', points: 15, duration: '30 min' },
    { id: 'eat-fruit', name: 'nutrition-outline', text: 'Eat Fruit', streak: 0, frequency: 'Everyday', category: 'Health', points: 10, duration: '5 min' },
    { id: 'practice-music', name: 'musical-notes-outline', text: 'Practice Music', streak: 0, frequency: 'Everyday', category: 'Learning', points: 25, duration: '45 min' },
    { id: 'drink-water', name: 'water-outline', text: 'Drink 8 glasses', streak: 1, frequency: 'Everyday', category: 'Health', points: 15, duration: 'All day' },
  ];


  // Combine goals properly
  const allGoals = [...defaultGoals, ...userHabits];
  const goalsByCategory = groupGoalsByCategory(allGoals);

  const handleToggleQuest = (questId) => {
    setCompletedQuests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questId)) {
        newSet.delete(questId);
      } else {
        newSet.add(questId);
      }
      return newSet;
    });
  };

  const handleStatsPress = () => {
    console.log('Navigate to stats page');
  };

  const handleAddHabit = () => {
    console.log('Navigate to add habits page');
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

            {/* Habit Cards Row */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.habitCardsContainer}
            >
              {userHabits.map((habit) => (
                <TouchableOpacity 
                  key={habit.id} 
                  style={styles.habitCard}
                  onPress={handleStatsPress}
                >
                  <Ionicons name={habit.name} size={32} color="#4CAF50" />

                  <View style={styles.streakRow}>
                  <ThemedText title={true} style={styles.habitStreak}>
                    {habit.streak}
                  </ThemedText>
                  <ThemedText style={styles.habitStreakLabel}>Days</ThemedText>

                  </View>

                  <ThemedText style={styles.habitTitle}>{habit.text}</ThemedText>
                  <ThemedText style={styles.habitFrequency}>{habit.frequency}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {Object.entries(goalsByCategory).map(([categoryName, categoryGoals]) => {
            if (categoryGoals.length === 0) return null;

            return (
              <View key={categoryName} style={styles.categorySection}>
                {/* Category Header */}
                <ThemedText title={true} style={styles.categoryTitle}>
                  {categoryName}
                </ThemedText>

                {categoryGoals.map((goal, index) => (
                  <View key={goal.id}>
                    <ThemedGoal
                      name={goal.name || goal.icon}
                      text={goal.text || goal.title}
                      points={goal.points}
                      category={goal.category}
                      duration={goal.duration || goal.defaultDuration}
                      completed={completedQuests.has(goal.id)}
                      onToggle={() => handleToggleQuest(goal.id)}
                    />
                    {index < categoryGoals.length - 1 && <Spacer height={12} />}
                  </View>
                ))}

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
});