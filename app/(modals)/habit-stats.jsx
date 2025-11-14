import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Modal,TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from '../../components/BackButton';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import Spacer from '../../components/Spacer';
import WaterIntakeInput from '../../components/WaterIntakeInput';
import { useAuthStore } from '../../store/authStore';

const HabitStats = () => {
  const { userHabits, habitCompletions, removeHabit, toggleHabitCompletion,updateHabit } = useAuthStore();
  const params = useLocalSearchParams();
  const habitId = params.habitId;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedFrequency, setEditedFrequency] = useState('');
  const [editedDuration, setEditedDuration] = useState('');

  // Find the specific habit
  const habit = useMemo(() => 
    userHabits.find(h => h.id === habitId), 
    [userHabits, habitId]
  );

  const openEditModal = () => {
    if (!habit) {
    Alert.alert('Error', 'Habit data not available');
    return;
  }

    setEditedName(habit.text || '');
    setEditedFrequency(habit.frequency || 'Everyday');
    setEditedDuration(habit.duration || '5 min'); // ✅ Add fallback
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Habit name cannot be empty');
      return;
    }

    console.log('Before update - streak:', habit.streak, 'lastCompleted:', habit.lastCompleted);

    const updatedHabit = {
      ...habit,
      text: editedName.trim(),
      frequency: editedFrequency,
      duration: editedDuration,
    };
    
    console.log('Updating habit with:', updatedHabit);

    updateHabit(habitId, updatedHabit);
    setShowEditModal(false);

    console.log('After update - should preserve streak');
  };

  const frequencyOptions = [
    'Everyday',
    'Weekdays only',
    'Weekends only',
    '3 times per week',
    'Once a week',
    '2 times per week',
    '4 times per week',
    '5 times per week',
    'Every 2 weeks',
    'Once a month'
  ];

  const durationOptions = [
    '5 min',
    '10 min',
    '15 min',
    '20 min',
    '30 min',
    '45 min',
    '1 hour',
    '1.5 hours',
    '2 hours',
    'All day'
  ];

  // Calculate stats
  const stats = useMemo(() => {
    if (!habit || !habitCompletions[habitId]) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        totalCompletions: 0,
        completionRate: 0,
        weeklyCompletions: 0,
        monthlyCompletions: 0
      };
    }

    const completions = habitCompletions[habitId];
    const completionDates = Object.keys(completions).filter(date => completions[date]);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (completions[dateStr]) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedDates = completionDates.sort();
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    // Weekly completions (last 7 days)
    const weeklyCompletions = completionDates.filter(date => {
      const completionDate = new Date(date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return completionDate >= weekAgo;
    }).length;

    // Monthly completions (last 30 days)
    const monthlyCompletions = completionDates.filter(date => {
      const completionDate = new Date(date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return completionDate >= monthAgo;
    }).length;

    // Completion rate (last 30 days)
    const completionRate = monthlyCompletions / 30 * 100;

    return {
      currentStreak,
      bestStreak,
      totalCompletions: completionDates.length,
      completionRate: Math.round(completionRate),
      weeklyCompletions,
      monthlyCompletions
    };
  }, [habit, habitCompletions, habitId]);

  const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

  // Generate calendar data (last 30 days)
   const calendarData = useMemo(() => {
    const today = getToday();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth);
    
    // Previous month days to fill the grid
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    const calendar = [];
    
    // Add previous month's trailing days (grayed out)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      calendar.push({
        date: formatDate(date),
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        isCompleted: habitCompletions[habitId]?.[formatDate(date)] || false,
        isPast: date < today
      });
    }
    
    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = formatDate(date) === formatDate(today);
      const isPast = date < today || isToday;
      
      calendar.push({
        date: formatDate(date),
        dayNumber: day,
        isCurrentMonth: true,
        isToday,
        isCompleted: habitCompletions[habitId]?.[formatDate(date)] || false,
        isPast: isPast || isToday
      });
    }
    
    // Add next month's leading days to complete the grid (6 rows × 7 days = 42 cells)
    const remainingCells = 42 - calendar.length;
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      calendar.push({
        date: formatDate(date),
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        isCompleted: habitCompletions[habitId]?.[formatDate(date)] || false,
        isPast: false
      });
    }
    
    return {
      monthName: currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
      days: calendar
    };
  }, [habitCompletions, habitId]);
    
    

  const handleDelete = () => {
  console.log('Attempting to delete habit:', habit);
  console.log('Habit ID:', habitId);
  console.log('All user habits:', userHabits);

  if (!habit) {
    Alert.alert('Error', 'Habit not found');
    return;
  }

    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit?.text}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Calling removeHabit with ID:', habitId);
            removeHabit(habitId);
            router.back();
          }
        }
      ]
    );
  };

  const handleToggleDay = (dateStr) => {
    toggleHabitCompletion(habitId, dateStr);
  };

  if (!habit) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Habit not found</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
           <BackButton style={{ backgroundColor: '#f1f5eeff' }} />
          
          <ThemedText title style={styles.title}>
            Habit Details
          </ThemedText>
          
          <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Habit Info Card */}
          <View style={styles.habitCard}>
            <View style={styles.habitIconContainer}>
              <Ionicons name={habit.name} size={40} color="#4CAF50" />
            </View>
            <View style={styles.habitInfo}>
              <ThemedText title style={styles.habitTitle}>
                {habit.text}
              </ThemedText>
              <ThemedText style={styles.habitMeta}>
                {habit.category} • {habit.frequency} • {habit.duration}
              </ThemedText>
              <ThemedText style={styles.habitPoints}>
                {habit.points} points per completion
              </ThemedText>
              <TouchableOpacity
              onPress={handleDelete}
              style={styles.removeButton}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.removeButtonText}>Remove from habits</ThemedText>
            </TouchableOpacity>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText title style={styles.statNumber}>
                {stats.currentStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
              <Ionicons name="flame" size={20} color="#FF6B35" />
            </View>
            
            <View style={styles.statCard}>
              <ThemedText title style={styles.statNumber}>
                {stats.bestStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Best Streak</ThemedText>
              <Ionicons name="trophy" size={20} color="#FFD700" />
            </View>
            
            <View style={styles.statCard}>
              <ThemedText title style={styles.statNumber}>
                {stats.completionRate}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>30-Day Rate</ThemedText>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
            </View>
            
            <View style={styles.statCard}>
              <ThemedText title style={styles.statNumber}>
                {stats.totalCompletions}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Done</ThemedText>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
            </View>
          </View>

          {habit.id === 'water-intake' && (
           <WaterIntakeInput
             currentAmount={habitCompletions[habit.id]?.[new Date().toISOString().split('T')[0]] || 0}
             target={habit.target || 2000}
             onUpdate={(newAmount) => {
               const today = new Date().toISOString().split('T')[0];
               toggleHabitCompletion(habit.id, today, newAmount);
             }}
          />
        )}

          {/* Calendar */}
          <View style={styles.calendarSection}>
          <ThemedText title style={styles.sectionTitle}>
            {calendarData.monthName}
          </ThemedText>
          
          {/* Calendar Header (Days of Week) */}
          <View style={styles.calendarHeader}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'].map(day => (
              <View key={day} style={styles.dayHeader}>
                <ThemedText style={styles.dayHeaderText}>{day}</ThemedText>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarWrapper}>
          <View style={styles.calendar}>
            {calendarData.days.map((day, index) => {
              // Determine the style based on day state
              let dayStyle = [styles.calendarDay];
              let textStyle = [styles.dayText];
              
              if (!day.isCurrentMonth) {
                dayStyle.push(styles.otherMonthDay);
                textStyle.push(styles.otherMonthText);
              } else if (!day.isPast) {
                dayStyle.push(styles.futureDay);
                textStyle.push(styles.futureText);
              }
              
              if (day.isCompleted) {
                dayStyle.push(styles.completedDay);
                textStyle.push(styles.completedDayText);
              }
              
              if (day.isToday) {
                dayStyle.push(styles.todayDay);
                // Fix: Don't change text color if it's completed
                if (!day.isCompleted) {
                  textStyle.push(styles.todayText);
                }
              }

              return (
                <TouchableOpacity
                  key={`${day.date}-${index}`}
                  style={dayStyle}
                  onPress={() => day.isCurrentMonth ? handleToggleDay(day.date) : null}
                  activeOpacity={day.isCurrentMonth ? 0.7 : 1}
                  disabled={!day.isCurrentMonth}
                >
                  <ThemedText style={textStyle}>
                    {day.dayNumber}
                  </ThemedText>
                  
                  {/* Add completion indicator dot for better visibility */}
                  {day.isCompleted && (
                    <View style={styles.completionDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          </View>
          
          <ThemedText style={styles.calendarHint}>
            Tap any day in {calendarData.monthName.split(' ')[0]} to toggle completion
          </ThemedText>
        </View>
  

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <ThemedButton
              onPress={openEditModal}
              style={[styles.actionButton, styles.editButtonStyle]}
            >
              <View style={styles.editButtonRow}>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Edit Habit</ThemedText>
              </View>
            </ThemedButton>
          </View>

          <Spacer height={50} />
        </ScrollView>

        {/* Edit Modal Placeholder */}
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.editModalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalBackButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#666" />
                </TouchableOpacity>
                <ThemedText title style={styles.modalTitle}>
                  Edit Habit
                </ThemedText>
                <TouchableOpacity 
                  onPress={handleSaveEdit}
                  style={styles.modalSaveButton}
                >
                  <ThemedText style={styles.saveText}>Save</ThemedText>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.editModalScroll}>
                {/* Habit Name */}
                <View style={styles.editSection}>
                  <ThemedText style={styles.editLabel}>Habit Name</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter habit name"
                    maxLength={60}
                    multiline={false}
                  />
                </View>

                {/* Frequency */}
                <View style={styles.editSection}>
                  <ThemedText style={styles.editLabel}>Frequency</ThemedText>
                  <View style={styles.optionsGrid}>
                    {frequencyOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          editedFrequency === option && styles.selectedOption
                        ]}
                        onPress={() => setEditedFrequency(option)}
                        activeOpacity={0.7}
                      >
                        <ThemedText style={[
                          styles.optionText,
                          editedFrequency === option && styles.selectedOptionText
                        ]}>
                          {option}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Duration */}
                <View style={styles.editSection}>
                  <ThemedText style={styles.editLabel}>Duration</ThemedText>
                  <View style={styles.optionsGrid}>
                    {durationOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          editedDuration === option && styles.selectedOption
                        ]}
                        onPress={() => setEditedDuration(option)}
                        activeOpacity={0.7}
                      >
                        <ThemedText style={[
                          styles.optionText,
                          editedDuration === option && styles.selectedOptionText
                        ]}>
                          {option}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Habit Info */}
                <View style={styles.editSection}>
                  <ThemedText style={styles.editLabel}>Category & Points</ThemedText>
                  <View style={styles.infoRow}>
                    <ThemedText style={styles.infoText}>
                      Category: {habit.category}
                    </ThemedText>
                    <ThemedText style={styles.infoText}>
                      Points: {habit.points} per completion
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.infoHint}>
                    Category and points cannot be changed
                  </ThemedText>
                </View>

                <Spacer height={30} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
};

export default HabitStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    color: '#2c3e50',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Habit Card
  habitCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  habitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 6,
  },
  habitMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  habitPoints: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },

  calendarSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Calendar Header
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  
  // Calendar Grid
  calendarWrapper: {
  borderRadius: 12,
  backgroundColor: 'white',
  overflow: 'hidden', // This should work on the wrapper
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  marginBottom: 12,
  padding:5,
  height:305,
},
calendar: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: 'transparent', 
  justifyContent: 'space-between',
},
  calendarDay: {
    width: '13%', 
    aspectRatio: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding:5,
    margin:1,
    position: 'relative',
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  
  // Day States
  otherMonthDay: {
    backgroundColor: 'transparent',
  },
  futureDay: {
    backgroundColor: '#f8f9fa',
    borderColor: '#f0f0f0',
  },
  completedDay: {
    backgroundColor: '#4CAF50',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  
  // Text Styles
  dayText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign:'center'
  },
  otherMonthText: {
    color: '#ccc',
  },
  futureText: {
    color: '#999',
  },
  completedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  todayText: {
    color: '#2196F3',
    fontWeight: '700',
  },
  
  // Completion Indicator
  completionDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  calendarHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Action Buttons
  actionButtons: {
    gap: 12,
    paddingHorizontal:60
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButtonStyle: {
    backgroundColor: '#4CAF50',
  },
  editButtonRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // Aligns text 
    justifyContent:'center',
    gap:7,
  },
  removeButton: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    maxWidth: 320,
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
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
   // Edit Modal Styles
  editModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    marginTop: 'auto',
  },
  modalBackButton: {
    padding: 8,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editModalScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Edit Sections
  editSection: {
    marginBottom: 30,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  // Options Grid
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },

  // Info Section
  infoRow: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});