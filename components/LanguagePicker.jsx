import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { useTranslation } from "../constants/translations"
import { getItem, setItem } from '../store/storage';
import { useAuthStore } from '../store/authStore';
import { getExtraGoals } from '../app/(activities)/goalIdeas';
import i18n from '../constants/translations';

const LanguagePicker = ({ style }) => {
  const { currentLanguage, changeLanguage } = useTranslation();

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'el' : 'en';
    
    setTimeout(async () => {
      await setItem('selectedLanguage', newLanguage);
      changeLanguage(newLanguage);

      // ✅ Updated to pass getExtraGoals
      const { refreshHabitTranslations } = useAuthStore.getState();
      refreshHabitTranslations(i18n.t, getExtraGoals);
    }, 100);
  };

  const currentFlag = currentLanguage === 'en' 
    ? require('../assets/flags/american.png')
    : require('../assets/flags/greek.png');

  const currentName = currentLanguage === 'en' ? 'English' : 'Ελληνικά';

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={[styles.toggleContainer, style]}
      activeOpacity={0.7}
    >
      <Image source={currentFlag} style={styles.flagIcon} />
      <ThemedText style={styles.languageText}>{currentName}</ThemedText>
      <View style={styles.switchIndicator}>
        <View style={styles.otherFlag}>
          <Image 
            source={currentLanguage === 'en' 
              ? require('../assets/flags/greek.png')
              : require('../assets/flags/american.png')
            } 
            style={styles.smallFlag} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    top: 70, 
    right: 20, 
    zIndex: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  flagIcon: {
    width: 20,
    height: 15,
    marginRight: 8,
    borderRadius: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  switchIndicator: {
    marginLeft: 'auto',
  },
  otherFlag: {
    opacity: 0.6,
  },
  smallFlag: {
    width: 16,
    height: 12,
    borderRadius: 1,
  },
});

export default LanguagePicker;