import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import { useTranslation } from '../../constants/translations';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from '../../store/authStore';
import { PointsToast } from "../../components/PointsToast";
import { CustomAlert } from "../../components/CustomAlert";
import { Colors } from '../../constants/Colors';
import { getCategoryColor } from '../../constants/availableHabits';

  export const getExtraGoals = (t) => [
    // Tidying & Organization
    {
      id: 'tidy-bedroom',
      icon: 'bed-outline',
      title: t('goals.tidyBedroom'),
      description: t('goals.tidyBedroomDesc'),
      category: t('categories.home'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.15min'),
      points: 15,
      color: '#D4A574'
    },
    {
      id: 'tidy-kitchen',
      icon: 'restaurant-outline',
      title: t('goals.tidyKitchen'),
      description: t('goals.tidyKitchenDesc'),
      category: t('categories.home'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.15min'),
      points: 15,
      color: '#D4A574'
    },
    {
      id: 'tidy-bathroom',
      icon: 'water-outline',
      title: t('goals.tidyBathroom'),
      description: t('goals.tidyBathroomDesc'),
      category: t('categories.home'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.10min'),
      points: 10,
      color: '#D4A574'
    },
    {
      id: 'tidy-livingroom',
      icon: 'tv-outline',
      title: t('goals.tidyLivingRoom'),
      description: t('goals.tidyLivingRoomDesc'),
      category: t('categories.home'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.15min'),
      points: 15,
      color: '#D4A574'
    },
    
    // Self Care
    {
      id: 'skincare-routine',
      icon: 'sparkles-outline',
      title: t('goals.skincareRoutine'),
      description: t('goals.skincareRoutineDesc'),
      category: t('categories.selfcare'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.10min'),
      points: 15,
      color: '#D989AA'
    },
    {
      id: 'take-bath',
      icon: 'water-outline',
      title: t('goals.takeBath'),
      description: t('goals.takeBathDesc'),
      category: t('categories.selfcare'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.30min'),
      points: 20,
      color: '#D989AA'
    },
    {
      id: 'pamper-day',
      icon: 'heart-circle-outline',
      title: t('goals.pamperDay'),
      description: t('goals.pamperDayDesc'),
      category: t('categories.selfcare'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.1hour'),
      points: 25,
      color: '#D989AA'
    },
    
    // Exercise specific
    {
      id: 'yoga-session',
      icon: 'body-outline',
      title: t('goals.yogaSession'),
      description: t('goals.yogaSessionDesc'),
      category: t('categories.fitness'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.30min'),
      points: 25,
      color: '#6B9E78'
    },
    {
      id: 'walk-10k-steps',
      icon: 'walk-outline',
      title: t('goals.walk10kSteps'),
      description: t('goals.walk10kStepsDesc'),
      category: t('categories.fitness'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.allDay'),
      points: 30,
      color: '#6B9E78'
    },
    {
      id: 'stretch-routine',
      icon: 'fitness-outline',
      title: t('goals.stretchRoutine'),
      description: t('goals.stretchRoutineDesc'),
      category: t('categories.fitness'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.10min'),
      points: 15,
      color: '#6B9E78'
    },
    
    // Sleep specific
    {
      id: 'sleep-8-hours',
      icon: 'moon-outline',
      title: t('goals.sleep8Hours'),
      description: t('goals.sleep8HoursDesc'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.allNight'),
      points: 25,
      color: '#A5B68D'
    },
    {
      id: 'power-nap',
      icon: 'time-outline',
      title: t('goals.powerNap'),
      description: t('goals.powerNapDesc'),
      category: t('categories.health'),
      difficulty: t('difficulties.easy'),
      duration: t('durations.20min'),
      points: 10,
      color: '#A5B68D'
    },
    {
      id: 'sleep-before-11',
      icon: 'alarm-outline',
      title: t('goals.sleepBefore11'),
      description: t('goals.sleepBefore11Desc'),
      category: t('categories.health'),
      difficulty: t('difficulties.medium'),
      duration: t('durations.evening'),
      points: 20,
      color: '#A5B68D'
    }
  ];

export default function GoalIdeas() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userHabits, addHabits } = useAuthStore();
  const [addedGoals, setAddedGoals] = useState(new Set());
  const [toastConfig, setToastConfig] = useState({ visible: false, points: 0, message: '' });
  const [alertConfig, setAlertConfig] = useState(null);

  const extraGoals = getExtraGoals(t);
  
  const existingHabitIds = userHabits.map(h => h.id);
  const availableGoals = extraGoals.filter(goal => 
    !existingHabitIds.includes(goal.id)
  );

  const handleAlert = (title, message, onConfirmAction) => {
  setAlertConfig({
    type: 'error',
    title: title,
    message: message,
    showCancel: true,
    onConfirm: async () => {
      try {
        if (onConfirmAction) {
          await onConfirmAction();
        }
        setAlertConfig(null);
      } catch (error) {
        //console.log('Alert action error:', error);
        setAlertConfig(null);
      }
    }, 
    onClose: () => setAlertConfig(null)
  });
}

  const groupedGoals = availableGoals.reduce((groups, goal) => {
    const category = goal.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(goal);
    return groups;
  }, {});

  const handleAddGoal = async (goal) => {
    try {
      console.log('Adding goal as habit:', goal.title);

      const newHabit = {
        id: goal.id,
        icon: goal.icon,
        category: goal.category,
        difficulty: goal.difficulty,
        duration: goal.duration,
        points: goal.points,
        color: goal.color,
        text: goal.title,  // Store the translated title
        title: goal.title, // Also keep title for compatibility
        name: goal.icon,
        createdAt: new Date().toISOString(),
        isActive: true,
        streak: 0,
        lastCompleted: null,
        frequency: 'daily'
      };

      const result = await addHabits(newHabit);

      if (result.success) {
        setAddedGoals(prev => new Set([...prev, goal.id]));
        setToastConfig({
          visible: true,
         // points: goal.points,
          message: t('goals.addedMessage', { habit: goal.title })
        });
      } else {
        console.error('Failed to add goal:', result?.error);
        handleAlert(t('goals.error'), t('goals.errorMessage'));
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      handleAlert(t('goals.error'), t('goals.errorMessage'));
    }
  };

  const renderGoalItem = (goal) => {
    const isAdded = addedGoals.has(goal.id);
    
    return (
      <TouchableOpacity
        key={goal.id}
        style={[
          styles.goalCard,
          isAdded && styles.goalCardAdded
        ]}
        onPress={() => !isAdded && handleAddGoal(goal)}
        activeOpacity={isAdded ? 1 : 0.7}
        disabled={isAdded}
      >
        <View style={[styles.iconContainer
          ,{ backgroundColor: `${goal.color}15` }
          ]}>
          <Ionicons 
            name={goal.icon} 
            size={24} 
            color={isAdded ? '#4CAF50' : goal.color}
          />
        </View>
        
        <View style={styles.goalTextContainer}>
          <ThemedText title style={[
            styles.goalTitle,
            isAdded && styles.goalTitleAdded
          ]}>
            {goal.title}
          </ThemedText>
         <ThemedText style={[styles.goalDescription
         ]}>
            {goal.description}
          </ThemedText> 
          <View style={styles.goalMeta}>
            <ThemedText style={[styles.category,
               {color:getCategoryColor(goal.category, t)}
            ]}
            >
              {goal.category}
              </ThemedText>
            <Ionicons name="flash" size={14} color="#FFD700" />
            <ThemedText style={styles.points}>+{goal.points}</ThemedText>
            <ThemedText style={styles.duration}>{goal.duration} </ThemedText>
          </View>
        </View>
        
        <Ionicons 
          name={isAdded ? "checkmark-circle" : "add-circle"} 
          size={28} 
          color={isAdded ? '#4CAF50' : goal.color} 
        />
      </TouchableOpacity>
    );
  };

  const renderCategory = (categoryName, goals) => (
    <View key={categoryName} style={styles.categorySection}>
      <ThemedText title={true} style={[styles.categoryTitle]}>
        {categoryName}
      </ThemedText>
      {goals.map(renderGoalItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton
        style={{ backgroundColor: '#f1f5eeff' }}
        onPress={() => router.push('/(dashboard)/activities')}
      />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText title={true} style={styles.title}>
            {t('goals.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('goals.tapToAdd')}
          </ThemedText>
        </View>

        {availableGoals.length > 0 ? (
          <FlatList
            data={Object.entries(groupedGoals)}
            renderItem={({ item: [categoryName, goals] }) => 
              renderCategory(categoryName, goals)
            }
            keyExtractor={([categoryName]) => categoryName}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={64} color="#4CAF50" />
            <ThemedText style={styles.emptyTitle}>
              {t('goals.allAdded')}
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {t('goals.allAddedDesc')}
            </ThemedText>
          </View>
        )}

        {alertConfig && (
         <CustomAlert
             type={alertConfig.type}
             title={alertConfig.title}
             message={alertConfig.message}
             showCancel={alertConfig.showCancel}
             onConfirm={alertConfig.onConfirm}
             onClose={alertConfig.onClose}
         />
        )}

        {toastConfig &&   
          <PointsToast
          visible={toastConfig.visible}
          //points={toastConfig.points}
          message={toastConfig.message}
          onDismiss={() => setToastConfig({ visible: false, points: 0, message: '' })}
          duration={3000}
        />}

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    marginBottom: 12,
    color: '#333',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalCardAdded: {
    backgroundColor: '#F1F8F4',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink:0,
  },
  goalTextContainer: {
    flex: 1,
    marginRight:8,
    minWidth:0,
  },
  goalText: {
    fontSize: 12,
    color: '#999',
  },
  goalTitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  category: {
      fontSize: 12,
      color: '#666',
      marginRight: 12,
    },
  duration: {
      fontSize: 12,
      color: '#666',
    },
  goalTitleAdded: {
    color: '#4CAF50',
  },
  goalDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  goalMeta: {
    flexDirection:'row',
    //gap:5,
    alignItems:'center',
    //flexWrap:'wrap'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  points: {
    fontSize: 12,
    //color: '#FF9800',
    //color:'#FFD700',
    //color: '#4CAF50',
    color: '#666',
    marginRight: 10,
  },
});