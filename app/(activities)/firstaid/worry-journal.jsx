import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Alert, FlatList,ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import ThemedButton from '../../../components/ThemedButton';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { CustomAlert } from "../../../components/CustomAlert";
import { formatDate } from "../../../constants/dateFormatter";

export default function WorryJournal() {
  const router = useRouter();
  const { t,currentLanguage } = useTranslation();
  const { addWorryEntry, getWorryEntries,worryEntries } = useAuthStore();

  const [worry, setWorry] = useState('');
  //const [worryList,setWorryList] = useState([]);
  const [alertConfig, setAlertConfig] = useState(null);

  

  const handleAlert = (type,title, message, onConfirmAction) => {
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
  }

  const handleSave = () => {
    if (worry.trim().length === 0) {
      handleAlert('error',t('common.error'), t('firstAid.worryJournal.emptyError'));
      return;
    }

    const newEntry = {
      //id: Date.now().toString(),
      text: worry.trim(),
      timestamp: new Date().toISOString(),
    };

    addWorryEntry(newEntry);
    setWorry('');
    //setWorryList(getWorryEntries());

    handleAlert('success',
      t('firstAid.worryJournal.saved'),
      t('firstAid.worryJournal.savedMessage')
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="journal-outline" size={40} color="#FFA726" />
          <ThemedText title={true} style={styles.title}>
            {t('firstAid.worryJournal.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('firstAid.worryJournal.subtitle')}
          </ThemedText>
        </View>


        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>
            {t('firstAid.worryJournal.prompt')}
          </ThemedText>
          
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            value={worry}
            onChangeText={setWorry}
            placeholder={t('firstAid.worryJournal.placeholder')}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />

          <ThemedButton
            style={styles.saveButton}
            onPress={handleSave}
            disabled={worry.trim().length === 0}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <ThemedText style={styles.saveButtonText}>
              {t('firstAid.worryJournal.save')}
            </ThemedText>
          </ThemedButton>
        </View>

        <FlatList
          data={worryEntries}
          renderItem={({ item }) => (
            <View style={styles.worryCard}>
              <ThemedText style={styles.worryText}>{item.text}</ThemedText>
              <ThemedText style={styles.worryDate}>
                {formatDate(item.timestamp, currentLanguage, true)}
              </ThemedText>
            </View>
          )}
          keyExtractor={(item) => item.id || item.timestamp}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={64} color="#E0E0E0" />
              <ThemedText style={styles.emptyText}>
                {t('firstAid.worryJournal.noWorries')}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA726',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft:8
  },
  historySection: {
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  worryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  worryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  worryDate: {
    marginLeft: 6,
    fontSize: 12,
    color: '#999',
  },
  worryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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