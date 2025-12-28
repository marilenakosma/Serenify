import { useState } from 'react';
import { StyleSheet, TextInput, FlatList, View, TouchableOpacity } from 'react-native';
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
import { Colors } from '../../constants/Colors';

export default function Reflections() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();
  const { saveReflection, reflections, addPoints, deleteReflection } = useAuthStore();
  
  const [reflection, setReflection] = useState('');
  const [alertConfig, setAlertConfig] = useState(null);
  const params = useLocalSearchParams();
  const prompt = t(params.prompt) || t('reflections.defaultPrompt');

  const handleAlert = (type, title, message, onConfirmAction) => {
    setAlertConfig({
          type: type,
          title: title,
          message: message,
          showCancel: !!onConfirmAction,
          onConfirm: async () => {
            try {
              if (onConfirmAction) {
                await onConfirmAction();
              }
              setAlertConfig(null);
            } catch (error) {
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

  const handleDelete = (item) => {
    handleAlert(
      'error',
      t('common.delete') || 'Delete',
      t('reflections.deleteConfirm') || 'Are you sure you want to delete this reflection?',
      async () => {
        await deleteReflection(item.id);
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{ backgroundColor: '#f1f5eeff' }} onPress={() => router.push('/activities')} />

        <ThemedView style={styles.container}>
            <View style={styles.header}>
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
              <View style={styles.reflectionContent}>
                <ThemedText style={styles.reflectionText}>
                  {item.text}
                </ThemedText>
                <ThemedText style={styles.reflectionDate}>
                  {formatDate(item.timestamp, currentLanguage, true)}
                </ThemedText>
                <View style={styles.reflectionPointsBadge}>
                  <Ionicons name="flash" size={18} color="#FFD700" />
                  <ThemedText style={styles.reflectionPointsText}>
                    +20
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleDelete(item)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id || item.timestamp}
          ListEmptyComponent={
                      <View style={styles.emptyState}>
                        <Ionicons name="cloud-outline" size={64} color="#E0E0E0" />
                        <ThemedText style={styles.emptyText}>
                          {t('reflections.noReflections') || t('firstAid.worryJournal.noWorries')}
                        </ThemedText>
                      </View>
                    }
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
    backgroundColor: Colors.primary,
     padding: 12, 
     borderRadius: 8, 
     marginBottom: 16 
    },
  list: { 
    paddingBottom: 20,
    marginTop:16,
  },
  reflectionItem: { 
     backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: Colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  reflectionContent: {
    flex: 1,
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
    marginTop: 4,
  },
  reflectionPointsText:{
    color:'#4CAF50'
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        flexShrink:0,
      },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
 },
  emptyText: {
   marginTop: 16,
   fontSize: 16,
   color: '#999',
   textAlign: 'center',
  },
});