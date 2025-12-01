import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyContacts() {
  const router = useRouter();
  const { t } = useTranslation();

  const contacts = [
    {
      id: 'suicide-prevention',
      name: t('firstAid.emergency.suicidePrevention'),
      phone: '988',
      description: t('firstAid.emergency.suicidePreventionDesc'),
      icon: 'heart-outline',
      color: '#EF5350',
      available: t('firstAid.emergency.24_7')
    },
    {
      id: 'crisis-text',
      name: t('firstAid.emergency.crisisText'),
      phone: 'TEXT "HELLO" to 741741',
      description: t('firstAid.emergency.crisisTextDesc'),
      icon: 'chatbubble-outline',
      color: '#42A5F5',
      available: t('firstAid.emergency.24_7'),
      isText: true
    },
    {
      id: 'emergency',
      name: t('firstAid.emergency.emergency'),
      phone: '911',
      description: t('firstAid.emergency.emergencyDesc'),
      icon: 'medical-outline',
      color: '#FF5252',
      available: t('firstAid.emergency.24_7')
    },
    {
      id: 'domestic-violence',
      name: t('firstAid.emergency.domesticViolence'),
      phone: '1-800-799-7233',
      description: t('firstAid.emergency.domesticViolenceDesc'),
      icon: 'shield-outline',
      color: '#9575CD',
      available: t('firstAid.emergency.24_7')
    },
    {
      id: 'samhsa',
      name: t('firstAid.emergency.samhsa'),
      phone: '1-800-662-4357',
      description: t('firstAid.emergency.samhsaDesc'),
      icon: 'people-outline',
      color: '#66BB6A',
      available: t('firstAid.emergency.24_7')
    }
  ];

  const handleCall = (contact) => {
    if (contact.isText) {
      Alert.alert(
        contact.name,
        t('firstAid.emergency.textInstructions'),
        [{ text: t('common.ok') }]
      );
    } else {
      Alert.alert(
        t('firstAid.emergency.callConfirm'),
        `${contact.name}\n${contact.phone}`,
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('firstAid.emergency.call'), 
            onPress: () => Linking.openURL(`tel:${contact.phone.replace(/[^0-9]/g, '')}`)
          }
        ]
      );
    }
  };

  const renderContact = (contact) => (
    <TouchableOpacity
      key={contact.id}
      style={[styles.contactCard, { borderLeftColor: contact.color }]}
      onPress={() => handleCall(contact)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${contact.color}15` }]}>
        <Ionicons name={contact.icon} size={32} color={contact.color} />
      </View>

      <View style={styles.contactContent}>
        <ThemedText style={styles.contactName}>
          {contact.name}
        </ThemedText>
        <ThemedText style={styles.contactPhone}>
          {contact.phone}
        </ThemedText>
        <ThemedText style={styles.contactDescription}>
          {contact.description}
        </ThemedText>
        <View style={styles.availabilityBadge}>
          <Ionicons name="time-outline" size={14} color="#4CAF50" />
          <ThemedText style={styles.availabilityText}>
            {contact.available}
          </ThemedText>
        </View>
      </View>

      <Ionicons 
        name={contact.isText ? "chatbubble" : "call"} 
        size={24} 
        color={contact.color} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="call-outline" size={40} color="#EF5350" />
          <ThemedText title={true} style={styles.title}>
            {t('firstAid.emergency.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('firstAid.emergency.subtitle')}
          </ThemedText>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle-outline" size={24} color="#EF5350" />
            <ThemedText style={styles.warningText}>
              {t('firstAid.emergency.warning')}
            </ThemedText>
          </View>

          <View style={styles.contactsContainer}>
            {contacts.map(renderContact)}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#42A5F5" />
            <ThemedText style={styles.infoText}>
              {t('firstAid.emergency.info')}
            </ThemedText>
          </View>
        </ScrollView>
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
    backgroundColor: '#f1f5eeff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#EF5350',
  },
  warningText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#C62828',
    flex: 1,
    lineHeight: 20,
    fontWeight: '600',
  },
  contactsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: '#42A5F5',
    fontWeight: '600',
    marginBottom: 6,
  },
  contactDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 13,
    color: '#1976D2',
    flex: 1,
    lineHeight: 20,
  },
});