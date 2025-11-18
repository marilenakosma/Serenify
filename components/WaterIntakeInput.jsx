import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import { useTranslation } from '../constants/translations';

const WaterIntakeInput = ({ currentAmount = 0, target = 2000, onUpdate }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { t } = useTranslation();

  // Quick increment options
  const quickIncrements = [250, 500, 750]; // ml

  const handleQuickAdd = (amount) => {
    const newAmount = currentAmount + amount;
    onUpdate(Math.min(newAmount, target * 2)); // Cap at 2x target
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handleQuickAdd(amount);
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  const progress = Math.min(currentAmount / target, 1);

  return (
    <View style={styles.container}>
      {/* Progress Display */}
      <View style={styles.progressSection}>
        <ThemedText style={styles.progressTitle}>{t('water.intakeToday')}</ThemedText>
        <ThemedText style={styles.progressAmount}>
           {currentAmount} / {target} {t('water.ml')}
        </ThemedText>
        
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        
        <ThemedText style={styles.progressPercentage}>
          {Math.round(progress * 100)}{t('water.percentOfGoal')}
        </ThemedText>
      </View>

      {/* Quick Add Buttons */}
      <View style={styles.quickAddSection}>
        <ThemedText style={styles.sectionTitle}>{t('water.quickAdd')}</ThemedText>
        <View style={styles.quickAddButtons}>
          {quickIncrements.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAddButton}
              onPress={() => handleQuickAdd(amount)}
            >
              <Ionicons name="water" size={24} color="#2196F3" />
               <Text style={styles.quickAddText}>+{amount}{t('water.ml')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Amount Input */}
      <View style={styles.customSection}>
        <TouchableOpacity
          style={styles.customToggle}
          onPress={() => setShowCustomInput(!showCustomInput)}
        >
          <ThemedText style={styles.customToggleText}>
             {t('water.customAmount')} {showCustomInput ? '−' : '+'}
          </ThemedText>
        </TouchableOpacity>

        {showCustomInput && (
          <View style={styles.customInput}>
            <TextInput
              style={styles.input}
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder={t('water.enterMl')}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCustomAdd}
            >
              <Text style={styles.addButtonText}>{t('water.add')}</Text> 
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => onUpdate(0)}
      >
        <Ionicons name="refresh" size={20} color="#FF6B6B" />
        <Text style={styles.resetText}>{t('water.resetToday')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressAmount: {
    fontSize: 24,
    color: '#2196F3',
    marginBottom: 15,
    fontFamily: 'MontserratZ-SemiBold',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#666',
  },
  quickAddSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAddButton: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  quickAddText: {
    color: '#2196F3',
    marginTop: 5,
    fontFamily: 'MontserratZ-SemiBold',
  },
  customSection: {
    marginBottom: 25,
  },
  customToggle: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  customToggleText: {
    textAlign: 'center',
  },
  customInput: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    gap: 8,
  },
  resetText: {
    color: '#FF6B6B',
  },
});

export default WaterIntakeInput;