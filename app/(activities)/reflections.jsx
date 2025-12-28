import { useState } from 'react';
import { StyleSheet, TextInput, FlatList, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import { useTranslation } from '../../constants/translations';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlert } from "../../components/CustomAlert";
import { formatDate } from '../../constants/dateFormatter';

export default function Reflections() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();
  const { saveReflection, reflections, addPoints } = useAuthStore();
  
  const [reflection, setReflection] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);
  const params = useLocalSearchParams();
  const prompt = t(params.prompt) || t('reflections.defaultPrompt');

  const handleAlert = (type, title, message) => {
    setAlertConfig({
          type: type,
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
  };

  const handleSave = async () => {
    if (reflection.trim()) {
      const success = await saveReflection(reflection);

      if (success) {
        addPoints(20, 'reflection');
        setReflection('');
        
        handleAlert('success',
          t('reflections.saved') || 'Saved!',
          t('reflections.savedMessage') || 'Your reflection has been saved.'
        );
      } else {
        handleAlert('error',
          t('common.error'),
          t('reflections.saveError') || 'Failed to save reflection.'
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{ backgroundColor: '#f1f5eeff' }} onPress={() => router.push('/activities')} />

        <ThemedView style={styles.container}>
            <View style={styles.header}>
              <View style={[
                      styles.iconContainer,
                        {backgroundColor: `${"#C17BA3"}15`}
                      ]}>
              <Ionicons name="journal-outline" size={40} color={'#d68db6ff'}/>
                </View>
                <ThemedText title={true} style={styles.title}>
                  {t('reflections.title')}
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  {prompt}
                </ThemedText>
        </View>
        
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          value={reflection}
          onChangeText={setReflection}
          placeholder={t('reflections.placeholder')}
          placeholderTextColor="#999"
        />

        <ThemedButton 
          onPress={handleSave} 
          style={styles.saveButton}
          disabled={reflection.trim().length === 0}>
          <ThemedText style={{ color: '#fff' }}>
            {t('reflections.save')}
          </ThemedText>
        </ThemedButton>

        <FlatList
          data={reflections}
          renderItem={({ item }) => (
            <View style={styles.reflectionItem}>
              <ThemedText style={styles.reflectionText}>
                {item.text}
              </ThemedText>
              <ThemedText style={styles.reflectionDate}>
                {formatDate(item.timestamp, currentLanguage, true)}
              </ThemedText>
              <View style={styles.reflectionPointsBadge}>
                <Ionicons name="flash" size={18} color="#FFD700" />
                <ThemedText style={styles.reflectionPointsText}>
                  20
                </ThemedText>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id || item.timestamp}
          contentContainerStyle={styles.list}
        />

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
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f1f5eeff' 
  },
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f1f5eeff',
    },
    header: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 24,
      marginTop: 12,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
    },
  input: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      fontSize: 14,
      minHeight: 150,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      marginBottom: 16,
      color: '#333',
      fontFamily:'MontserratZ-Regular'
    },
  saveButton: { 
    backgroundColor: '#d68db6ff',
     padding: 12, 
     borderRadius: 8, 
     marginBottom: 16 
    },
  list: { 
    paddingBottom: 20,
    marginTop:16,
  },
  reflectionItem: { 
    paddingTop: 20,
    backgroundColor: '#E8F5E8', 
    borderRadius: 8,
    padding: 12, 
    marginBottom: 10 
  },
  reflectionText: { 
    fontSize: 16 
  },
  reflectionDate: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 4 
  },
  reflectionPointsBadge: {
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:4,
    alignSelf:'flex-end'
  },
  iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        flexShrink:0,
        //color: '#C17BA3'
      },
});