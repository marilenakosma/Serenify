import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import BackButton from '../../../components/BackButton';
import { useTranslation } from '../../../constants/translations';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Distraction() {
  const router = useRouter();
  const { t } = useTranslation();
  const [completed, setCompleted] = useState([]);

  const activities = [
    {
      id: 'count-backwards',
      icon: 'calculator-outline',
      title: t('firstAid.distraction.countBackwards'),
      description: t('firstAid.distraction.countBackwardsDesc'),
      color: '#42A5F5',
      action: () => showActivity(t('firstAid.distraction.countBackwards'), t('firstAid.distraction.countBackwardsInstruction'))
    },
    {
      id: 'name-5-things',
      icon: 'eye-outline',
      title: t('firstAid.distraction.name5Things'),
      description: t('firstAid.distraction.name5ThingsDesc'),
      color: '#66BB6A',
      action: () => showActivity(t('firstAid.distraction.name5Things'), t('firstAid.distraction.name5ThingsInstruction'))
    },
    {
      id: 'alphabet-game',
      icon: 'text-outline',
      title: t('firstAid.distraction.alphabetGame'),
      description: t('firstAid.distraction.alphabetGameDesc'),
      color: '#9575CD',
      action: () => showActivity(t('firstAid.distraction.alphabetGame'), t('firstAid.distraction.alphabetGameInstruction'))
    },
    {
      id: 'color-hunt',
      icon: 'color-palette-outline',
      title: t('firstAid.distraction.colorHunt'),
      description: t('firstAid.distraction.colorHuntDesc'),
      color: '#FF6B9D',
      action: () => showActivity(t('firstAid.distraction.colorHunt'), t('firstAid.distraction.colorHuntInstruction'))
    },
    {
      id: 'math-challenge',
      icon: 'calculator-outline',
      title: t('firstAid.distraction.mathChallenge'),
      description: t('firstAid.distraction.mathChallengeDesc'),
      color: '#FFA726',
      action: () => showActivity(t('firstAid.distraction.mathChallenge'), t('firstAid.distraction.mathChallengeInstruction'))
    },
    {
      id: 'word-association',
      icon: 'chatbubbles-outline',
      title: t('firstAid.distraction.wordAssociation'),
      description: t('firstAid.distraction.wordAssociationDesc'),
      color: '#26A69A',
      action: () => showActivity(t('firstAid.distraction.wordAssociation'), t('firstAid.distraction.wordAssociationInstruction'))
    },
    {
      id: 'body-scan',
      icon: 'body-outline',
      title: t('firstAid.distraction.bodyScan'),
      description: t('firstAid.distraction.bodyScanDesc'),
      color: '#7E57C2',
      action: () => showActivity(t('firstAid.distraction.bodyScan'), t('firstAid.distraction.bodyScanInstruction'))
    },
    {
      id: 'describe-object',
      icon: 'cube-outline',
      title: t('firstAid.distraction.describeObject'),
      description: t('firstAid.distraction.describeObjectDesc'),
      color: '#EC407A',
      action: () => showActivity(t('firstAid.distraction.describeObject'), t('firstAid.distraction.describeObjectInstruction'))
    }
  ];

  const showActivity = (title, instruction) => {
    Alert.alert(
      title,
      instruction,
      [
        { 
          text: t('common.done'), 
          onPress: () => markCompleted(title)
        }
      ]
    );
  };

  const markCompleted = (activityId) => {
    if (!completed.includes(activityId)) {
      setCompleted([...completed, activityId]);
    }
  };

  const renderActivity = (activity) => {
    const isCompleted = completed.includes(activity.id);

    return (
      <TouchableOpacity
        key={activity.id}
        style={[
          styles.activityCard,
          isCompleted && styles.activityCardCompleted
        ]}
        onPress={activity.action}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${activity.color}15` }]}>
          <Ionicons name={activity.icon} size={28} color={activity.color} />
        </View>

        <View style={styles.activityContent}>
          <ThemedText style={styles.activityTitle}>
            {activity.title}
          </ThemedText>
          <ThemedText style={styles.activityDescription}>
            {activity.description}
          </ThemedText>
        </View>

        {isCompleted && (
          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff'}} onPress={() => router.back()} />
      
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="game-controller-outline" size={40} color="#26A69A" />
          <ThemedText title={true} style={styles.title}>
            {t('firstAid.distraction.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('firstAid.distraction.subtitle')}
          </ThemedText>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoBox}>
            <Ionicons name="bulb-outline" size={24} color="#FFA726" />
            <ThemedText style={styles.infoText}>
              {t('firstAid.distraction.info')}
            </ThemedText>
          </View>

          {completed.length > 0 && (
            <View style={styles.progressBox}>
              <Ionicons name="trophy-outline" size={24} color="#FFB300" />
              <ThemedText style={styles.progressText}>
                {t('firstAid.distraction.completed')}: {completed.length}/{activities.length}
              </ThemedText>
            </View>
          )}

          <View style={styles.activitiesContainer}>
            {activities.map(renderActivity)}
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#F57C00',
    flex: 1,
    lineHeight: 20,
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
  },
  activitiesContainer: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activityCardCompleted: {
    backgroundColor: '#F1F8F4',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
});