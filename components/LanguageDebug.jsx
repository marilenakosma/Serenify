import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Localization from 'expo-localization';
import { getItem, setItem } from '../store/storage';
import { useTranslation } from '../constants/translations';

const LanguageDebug = () => {
  const deviceLocale = Localization.locale;
  const savedLanguage = getItem('selectedLanguage');
  const { t, changeLanguage, currentLanguage } = useTranslation();
  
  const forceGreek = () => {
    setItem('selectedLanguage', 'el');
    changeLanguage('el');
  };

  const forceEnglish = () => {
    setItem('selectedLanguage', 'en');
    changeLanguage('en');
  };
  
  return (
    <View style={{ padding: 20, backgroundColor: 'yellow', margin: 10 }}>
      <Text>Device Locale: {deviceLocale || 'EMPTY'}</Text>
      <Text>Saved Language: {savedLanguage || 'None'}</Text>
      <Text>Current i18n Language: {currentLanguage}</Text>
      
      <TouchableOpacity 
        onPress={forceGreek}
        style={{ backgroundColor: 'blue', padding: 10, margin: 5 }}
      >
        <Text style={{ color: 'white' }}>Force Greek</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={forceEnglish}
        style={{ backgroundColor: 'green', padding: 10, margin: 5 }}
      >
        <Text style={{ color: 'white' }}>Force English</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageDebug;