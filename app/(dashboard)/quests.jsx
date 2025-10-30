import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../../components/Spacer";
import BackButton from "../../components/BackButton";
import ThemedGoal from "../../components/ThemedGoal";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { useAuthStore } from "../../store/authStore";
import { questContent } from "../../constants/questContent";

const quests = () => {
  const { user } = useAuthStore();
  const [completedQuests, setCompletedQuests] = useState(new Set());
  
  const focusArea = user?.focusArea || 'General Wellness';
  const content = questContent[focusArea];

  const handleToggleQuest = (questId) => {
    setCompletedQuests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questId)) {
        newSet.delete(questId);
      } else {
        newSet.add(questId);
      }
      return newSet;
    });
  };

  const completedCount = completedQuests.size;
  const totalQuests = content.weeklyQuests.length + content.challengeQuests.length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <BackButton style={{ backgroundColor: '#f1f5eeff' }} />

        <ThemedText title={true} style={styles.title}>
          My Quests {user?.focusEmoji || '🎯'}
        </ThemedText>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Progress Header */}
          <ThemedView style={styles.progressCard}>
            <ThemedText style={styles.progressTitle}>
              {content.questTheme}
            </ThemedText>
            <ThemedText style={styles.progressText}>
              {completedCount} of {totalQuests} completed
            </ThemedText>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(completedCount / totalQuests) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </ThemedView>

          {/* Weekly Challenges Section */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: content.primaryColor }]}>
              Weekly Challenges
            </ThemedText>
          </ThemedView>

          {content.weeklyQuests.map((quest, index) => (
            <View key={quest.id}>
              <ThemedGoal
                name={quest.name}
                text={quest.text}
                points={quest.points}
                category={quest.category}
                duration={quest.duration}
                completed={completedQuests.has(quest.id)}
                onToggle={() => handleToggleQuest(quest.id)}
              />
              {index < content.weeklyQuests.length - 1 && <Spacer height={20} />}
            </View>
          ))}

          <Spacer height={30} />

          {/* Special Quests Section */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: content.secondaryColor }]}>
              Special Quests
            </ThemedText>
          </ThemedView>

          {content.challengeQuests.map((quest, index) => (
            <View key={quest.id}>
              <ThemedGoal
                name={quest.name}
                text={quest.text}
                points={quest.points}
                category={quest.category}
                duration={quest.duration}
                completed={completedQuests.has(quest.id)}
                onToggle={() => handleToggleQuest(quest.id)}
              />
              {index < content.challengeQuests.length - 1 && <Spacer height={20} />}
            </View>
          ))}

          <Spacer height={30} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

export default quests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5eeff'
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});