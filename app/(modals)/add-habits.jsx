import { useState,useMemo,useCallback } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BackButton from "../../components/BackButton";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { useAuthStore } from "../../store/authStore";
import { availableHabits,getAvailableHabits } from "../../constants/availableHabits";
import { useTranslation } from '../../constants/translations';
import { getCategoryColor } from '../../constants/availableHabits';

const AddHabits = () => {
  const { user, userHabits, addHabits } = useAuthStore();
  const [selectedHabits, setSelectedHabits] = useState(new Set());
  const { t } = useTranslation();
  
  const focusArea = user?.focusArea || 'General Wellness';
  const availableHabits = getAvailableHabits(t);
  
  //  Completely safe habit loading with guaranteed unique keys
  const safeHabits = useMemo(() => {
    const commonHabits = availableHabits.common || [];
    const personalizedHabits = availableHabits[focusArea] || [];
    
    // Use Map to ensure no duplicates
    const habitMap = new Map();
    
    [...commonHabits, ...personalizedHabits].forEach((habit, index) => {
      if (habit && habit.id) {
        // Add index to ensure uniqueness even if IDs somehow duplicate
        const safeKey = `${habit.id}-${index}`;
        habitMap.set(safeKey, { ...habit, safeKey });
      }
    });
    
    const allHabits = Array.from(habitMap.values());
    
    // Filter out existing habits
    const existingIds = userHabits.map(h => h.id);
    return allHabits.filter(habit => !existingIds.includes(habit.id));
  }, [focusArea, userHabits]);

  // Create safe categories with guaranteed unique items
  const safeCategories = useMemo(() => {
    const categories = {};
    
    safeHabits.forEach((habit, globalIndex) => {
      const category = habit.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      
      // Add global index to make each habit absolutely unique
      categories[category].push({
        ...habit,
        uniqueId: `${category}-${habit.id}-${globalIndex}`,
        globalIndex
      });
    });
    
    return categories;
  }, [safeHabits]);

  const toggleHabit = useCallback((habitId) => {
    setSelectedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  }, []);

  // Render individual habit component
  const HabitItem = useCallback(({ habit, categoryIndex, habitIndex }) => {
  const isSelected = selectedHabits.has(habit.id);
  const habitColor = getCategoryColor(habit.category, t);
  
  return (
    <TouchableOpacity
      style={[
        styles.habitItem,
        isSelected && styles.selectedHabitItem
      ]}
      onPress={() => toggleHabit(habit.id)}
      activeOpacity={0.7}
    >
      <View style={styles.habitIcon}>
        <Ionicons 
          name={habit.icon || 'checkmark-outline'} 
          size={28} 
          color={isSelected ? '#4CAF50' : habitColor} 
        />
      </View>
      
      <View style={styles.habitContent}>
        <ThemedText style={[
          styles.habitTitle,
          isSelected && styles.selectedText
        ]}>
          {habit.title}
        </ThemedText>
        
        <View style={styles.habitMeta}>
          <ThemedText style={[
            styles.habitMetaText,
            isSelected && styles.selectedText
          ]}>
            {habit.category}
          </ThemedText>
          <Ionicons name="flash" size={14} color={'#FFD700'} />
          <ThemedText style={[
            styles.habitPoints,
            isSelected && styles.selectedText
          ]}>
            +{habit.points}
          </ThemedText>
          <ThemedText style={[
            styles.habitMetaText,
            isSelected && styles.selectedText
          ]}>
            {habit.duration}
          </ThemedText>
        </View>
      </View>

      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
        ) : (
          <Ionicons name="add-circle" size={28} color={habitColor} />
        )}
      </View>
    </TouchableOpacity>
  );
}, [selectedHabits, toggleHabit, t]);

  const handleSave = () => {
    if (selectedHabits.size === 0) return;

    const habitIdsArray = Array.from(selectedHabits);
    const habitIdsParam = JSON.stringify(habitIdsArray);

    router.push({
    pathname: '/(modals)/habit-frequency',
    params: { habitIds: habitIdsParam }
  });
    

  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          <ThemedText title style={styles.title}>
            {t('habits.addNewHabits')}
          </ThemedText>
          
          <View style={styles.placeholder} />
        </View>
        
        <ThemedText style={styles.subtitle}>
          {t('habits.chooseHabits', { focusArea })}
        </ThemedText>

        {/* Completely safe rendering using Object.entries with guaranteed unique keys */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {selectedHabits.size > 0 && (
            <ThemedView style={styles.selectionSummary}>
              <ThemedText style={styles.summaryText}>
                {selectedHabits.size} {selectedHabits.size > 1 ? t('habits.habits') : t('habits.habit')} {selectedHabits.size > 1 ? t('habits.habitsSelected') : t('habits.selected')} 
              </ThemedText>
            </ThemedView>
          )}

          {Object.entries(safeCategories).map(([categoryName, habits], categoryIndex) => (
            <View 
              key={`category-${categoryIndex}-${categoryName}-${habits.length}`} 
              style={styles.categorySection}
            >
              <ThemedText title style={styles.categoryTitle}>
                {categoryName}
              </ThemedText>
              
              {habits.map((habit, habitIndex) => (
                <HabitItem
                  key={habit.uniqueId}
                  habit={habit}
                  categoryIndex={categoryIndex}
                  habitIndex={habitIndex}
                />
              ))}
              
              <Spacer height={20} />
            </View>
          ))}
          
          <Spacer height={100} />
        </ScrollView>

        {selectedHabits.size > 0 && (
          <View style={styles.bottomButtonContainer}>
            <ThemedButton 
              onPress={handleSave}
              style={styles.saveButton}
            >
              <ThemedText style={styles.saveButtonText}>
                {t('habits.add')} {selectedHabits.size} {selectedHabits.size > 1 ? t('habits.habits') : t('habits.habit')}
              </ThemedText>
            </ThemedButton>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
};

export default AddHabits;

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
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  
  // Selection Summary
  selectionSummary: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  summaryText: {
    color: '#4CAF50',
  },
  
  // Category Section
  categorySection: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 20,
    color: '#2c3e50',
    marginBottom: 15,
  },
  
  // Habit Items
  // Habit Items
habitItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  padding: 16,
  marginBottom: 8,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'transparent',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
selectedHabitItem: {
  backgroundColor: '#F1F8F4',
  borderColor: '#4CAF50',
},
habitIcon: {
  width: 48,
  height: 48,
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
habitContent: {
  flex: 1,
},
habitTitle: {
  fontSize: 15,
  color: '#2c3e50',
  marginBottom: 4,
},
habitDescription: {
  fontSize: 13,
  color: '#666',
  lineHeight: 18,
  marginBottom: 4,
},
habitMeta: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
},
habitMetaText: {
  fontSize: 12,
  color: '#666',
  marginRight: 5,
},
habitPoints: {
  fontSize: 12,
  color: '#666',
  marginRight: 10,
},
selectedText: {
  color: '#4CAF50',
},
selectionIndicator: {
  marginLeft: 12,
},
emptyCircle: {
  width: 28,
  height: 28,
  borderRadius: 14,
  borderWidth: 2,
  borderColor: '#ddd',
},
  
  // Bottom Button
  bottomButtonContainer: {
    position: 'absolute',
    alignItems:'center',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f1f5eeff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    width: '100%',
  },
  saveButtonText: {
    color: '#f2f2f2',
    fontSize: 16,
    fontWeight: '600',
  },
  //modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  placeholder: {
    width: 40, // Balance the close button
  },
  //no habits styles 
  noHabitsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noHabitsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  noHabitsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});