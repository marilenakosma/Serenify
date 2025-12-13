import { useState, useMemo } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { useAuthStore } from "../../store/authStore";
import { getAvailableHabits } from "../../constants/availableHabits";
import { FREQUENCY_TYPES } from '../../constants/habitFrequency';
import BackButton from "../../components/BackButton";
import { useTranslation } from '../../constants/translations';

const HabitFrequency = () => {
  const { addHabits } = useAuthStore();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [currentHabitForCustom, setCurrentHabitForCustom] = useState(null);
  const [customFrequency, setCustomFrequency] = useState('');
  
  // Parse selected habit IDs from route params
  const selectedHabitIds = useMemo(() => {
    try {
      return JSON.parse(params.habitIds || '[]');
    } catch {
      return [];
    }
  }, [params.habitIds]);

  // Get full habit objects
  const selectedHabits = useMemo(() => {
    const availableHabitsData = getAvailableHabits(t);
    const allHabits = [
      ...availableHabitsData.common,
      ...Object.values(availableHabitsData).flat()
    ];
    
    return selectedHabitIds.map(id => 
      allHabits.find(habit => habit.id === id)
    ).filter(Boolean);
  }, [selectedHabitIds,t]);

  // State: habitId -> frequency
  const [habitFrequencies, setHabitFrequencies] = useState(() => {
    const initial = {};
    selectedHabits.forEach(habit => {
      initial[habit.id] = FREQUENCY_TYPES.DAILY; // Default
    });
    return initial;
  });

  const frequencyOptions = [
    { value: FREQUENCY_TYPES.DAILY, label: t('frequency.daily'), icon: 'calendar-outline' },
    { value: FREQUENCY_TYPES.WEEKDAYS, label: t('frequency.weekdays'), icon: 'business-outline' },
    { value: FREQUENCY_TYPES.WEEKENDS, label: t('frequency.weekends'), icon: 'home-outline' },
    { value: FREQUENCY_TYPES.THREE_WEEKLY, label: t('frequency.threeWeekly'), icon: 'fitness-outline' },
    { value: FREQUENCY_TYPES.WEEKLY, label: t('frequency.weekly'), icon: 'calendar-outline' },
    { value: 'Custom', label: t('frequency.custom'), icon: 'settings-outline' }
  ];

  const customOptions = [
    { value: FREQUENCY_TYPES.TWO_WEEKLY, label: t('frequency.twoWeekly') },
    { value: FREQUENCY_TYPES.FOUR_WEEKLY, label: t('frequency.fourWeekly') },
    { value: FREQUENCY_TYPES.FIVE_WEEKLY, label: t('frequency.fiveWeekly') },
    { value: FREQUENCY_TYPES.BIWEEKLY, label: t('frequency.biweekly') },
    { value: FREQUENCY_TYPES.MONTHLY, label: t('frequency.monthly') },
  ];

  const updateFrequency = (habitId, frequency) => {
    if (frequency === 'Custom') {
      setCurrentHabitForCustom(habitId);
      setShowCustomModal(true);
    } else {
      setHabitFrequencies(prev => ({
        ...prev,
        [habitId]: frequency
      }));
    }
  };

  const handleCustomSelect = (customValue, customLabel) => {
    setHabitFrequencies(prev => ({
      ...prev,
      [currentHabitForCustom]: customValue
    }));
    setShowCustomModal(false);
    setCurrentHabitForCustom(null);
  };

  const handleSave = () => {
    const newHabits = selectedHabits.map(habit => ({
      id: habit.id,
      icon: habit.icon || 'checkmark-outline',
      title: habit.title,
      text: habit.title,
      streak: 0,
      frequency: habitFrequencies[habit.id],
      category: habit.category,
      points: habit.points || 10,
      duration: habit.duration || '5 min',
      dateAdded: new Date().toISOString(),
      lastCompleted: null,
      difficulty: habit.difficulty || 'Easy',
      description: habit.description || '',
    }));

    addHabits(newHabits);
    router.replace('/(dashboard)/habits');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>

          <BackButton style={styles.backButton}/>
          
          <ThemedText title style={styles.title}>
            {t('frequency.setFrequency')}
          </ThemedText>
          
          <View style={styles.placeholder} />
        </View>

        {/* Content container */}
        <View style={styles.contentContainer}>
          <ThemedText style={styles.subtitle}>
            {t('frequency.howOften', { 
              count: selectedHabits.length,
              type: selectedHabits.length === 1 ? t('frequency.habit') : t('frequency.habits')
            })}
          </ThemedText>

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {selectedHabits.map((habit, index) => (
              <View key={habit.id} style={styles.habitSection}>
                {/*  Habit Header */}
                <View style={styles.habitHeader}>
                  <View style={styles.habitInfo}>
                    <View style={styles.habitIconContainer}>
                      <Ionicons name={habit.icon} size={28} color="#4CAF50" />
                    </View>
                    <View style={styles.habitText}>
                      <ThemedText title style={styles.habitTitle}>
                        {habit.title}
                      </ThemedText>
                      <ThemedText style={styles.habitMeta}>
                        {habit.category} • {habit.duration}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Frequency Grid */}
                <View style={styles.frequencyContainer}>
                  <View style={styles.frequencyGrid}>
                    {frequencyOptions.map(option => {
                      const isSelected = habitFrequencies[habit.id] === option.value || 
                                        (option.value === 'Custom' && !frequencyOptions.some(opt => opt.value === habitFrequencies[habit.id]));
                      
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.frequencyOption,
                            isSelected && styles.selectedFrequency
                          ]}
                          onPress={() => updateFrequency(habit.id, option.value)}
                          activeOpacity={0.7}
                        >
                          <Ionicons 
                            name={option.icon} 
                            size={18} 
                            color={isSelected ? '#fff' : '#4CAF50'} 
                          />
                          <ThemedText style={[
                            styles.frequencyLabel,
                            isSelected && styles.selectedFrequencyText
                          ]}>
                            {option.value === 'Custom' && !frequencyOptions.some(opt => opt.value === habitFrequencies[habit.id])
                              ? habitFrequencies[habit.id] 
                              : option.label}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {index < selectedHabits.length - 1 && (
                  <View style={styles.habitDivider} />
                )}
              </View>
            ))}

            <Spacer height={120} />
          </ScrollView>
        </View>

        {/* Save Button */}
        <View style={styles.bottomButtonContainer}>
          <ThemedButton onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>
             {t('frequency.saveHabits')}
            </ThemedText>
          </ThemedButton>
        </View>

        {/* Frequency Modal */}
        <Modal
          visible={showCustomModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCustomModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText title style={styles.modalTitle}>
                  {t('frequency.customSchedule')}
                </ThemedText>
                <TouchableOpacity 
                  onPress={() => setShowCustomModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollView}>
                {customOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.customOption}
                    onPress={() => handleCustomSelect(option.value, option.label)}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={styles.customOptionText}>
                      {option.label}
                    </ThemedText>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
};

export default HabitFrequency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff',
    paddingTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical:15,
    paddingBottom: 10,
  },
  backButton: {
    backgroundColor: '#f1f5eeff'
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2c3e50',
    paddingTop: 10,
  },
  
  // content container
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
    maxWidth: 300,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  
  //  Habit Section
  habitSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 40,
  },
  habitHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  habitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitText: {
    marginLeft: 15,
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 4,
  },
  habitMeta: {
    fontSize: 14,
    color: '#666',
  },
  
  // Frequency Grid
  frequencyContainer: {
    alignItems: 'center',
    justifyContent:'center'
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    maxWidth: 350,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    marginBottom: 8,
    width: '48%',
    minWidth: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFrequency: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  frequencyLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  
  //  Habit divider
  habitDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  
  // Bottom Button
  bottomButtonContainer: {
    alignItems:'center',
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

  //  Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    maxWidth: 300,
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 250,
  },
  customOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customOptionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
});