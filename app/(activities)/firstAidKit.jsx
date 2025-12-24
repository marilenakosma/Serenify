import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import BackButton from '../../components/BackButton';
import { useTranslation } from '../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FirstAidKit() {
  const router = useRouter();
  const { t } = useTranslation();

  const exercises = [
    {
      id: 'grounding',
      icon: 'hand-left-outline',
      title: t('firstAid.grounding.title'),
      description: t('firstAid.grounding.description'),
      color: '#66BB6A',
      route: '/(activities)/firstaid/grounding'
    },
    {
      id: 'muscle-relaxation',
      icon: 'body-outline',
      title: t('firstAid.muscleRelaxation.title'),
      description: t('firstAid.muscleRelaxation.description'),
      color: '#42A5F5',
      route: '/(activities)/firstaid/muscle-relaxation'
    },
    {
      id: 'affirmations',
      icon: 'heart-outline',
      title: t('firstAid.affirmations.title'),
      description: t('firstAid.affirmations.description'),
      color: '#FF6B9D',
      route: '/(activities)/firstaid/affirmations'
    },
    {
      id: 'box-breathing',
      icon: 'leaf-outline',
      title: t('firstAid.boxBreathing.title'),
      description: t('firstAid.boxBreathing.description'),
      color: '#9575CD',
      route: '/(activities)/breathe' 
    },
    {
      id: 'worry-journal',
      icon: 'journal-outline',
      title: t('firstAid.worryJournal.title'),
      description: t('firstAid.worryJournal.description'),
      color: '#FFA726',
      route: '/(activities)/firstaid/worry-journal'
    }
  ];
   /* {
      id: 'emergency-contacts',
      icon: 'call-outline',
      title: t('firstAid.emergency.title'),
      description: t('firstAid.emergency.description'),
      color: '#EF5350',
      route: '/(activities)/firstaid/emergency-contacts'
    }
  ];

  /*  prin to emergency contacts   {
      id: 'distraction',
      icon: 'game-controller-outline',
      title: t('firstAid.distraction.title'),
      description: t('firstAid.distraction.description'),
      color: '#26A69A',
      route: '/(activities)/firstaid/distraction'
    },*/

  const renderExercise = (exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.exerciseCard}
      onPress={() => router.push(exercise.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${exercise.color}15` }]}>
        <Ionicons name={exercise.icon} size={28} color={exercise.color} />
      </View>
      
      <View style={styles.exerciseContent}>
        <ThemedText title style={styles.exerciseTitle}>
          {exercise.title}
        </ThemedText>
        <ThemedText style={styles.exerciseDescription}>
          {exercise.description}
        </ThemedText>
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton
        style={{ backgroundColor: '#f1f5eeff' }}
        onPress={() => router.push('/(dashboard)/activities')}
      />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="medical" size={40} color="#EF5350" />
          <ThemedText title={true} style={styles.title}>
            {t('firstAid.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('firstAid.subtitle')}
          </ThemedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map(renderExercise)}
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
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
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
  },
});