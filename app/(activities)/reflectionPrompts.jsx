import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import BackButton from '../../components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from '../../constants/translations';

const prompts = [
  { 
    key: 'energy',
    tKey: 'reflections.energy', 
    icon: 'flash-outline', 
    color: '#4FC3F7' 
  },
  { 
    key: 
    'drain', 
    tKey: 'reflections.drain', 
    icon: 'rainy-outline', 
    color: '#FF7043' 
  },
  { 
    key: 'gratitude', 
    tKey: 'reflections.gratitude', 
    icon: 'heart-outline', 
    color: '#FF6B9D' 
  },
  { 
    key: 'mind',
    tKey: 'reflections.mind', 
    icon: 'chatbubble-outline', 
    color: '#9575CD' 
    },
  { 
    key: 'positive', 
    tKey: 'reflections.positive', 
    icon: 'sunny-outline', 
    color: '#FFB300' 
  },
  { 
    key: 'confidence', 
    tKey: 'reflections.confidence', 
    icon: 'sad-outline', 
    color: '#E91E63' 
  },
  { 
    key: 'unhappiness', 
    tKey: 'reflections.unhappiness', 
    icon: 'thunderstorm-outline', 
    color: '#607D8B' 
  },
  { 
    key: 'worries', 
    tKey: 'reflections.worries', 
    icon: 'time-outline', 
    color: '#00ACC1' 
  },
  { 
    key: 'newExperience', 
    tKey: 'reflections.newExperience', 
    icon: 'rocket-outline', 
    color: '#7E57C2' 
  },
  { key: 'free', 
    tKey: 'reflections.free', 
    icon: 'create-outline', 
    color: '#45B7D1' 
  }
];

export default function ReflectionPrompts() {
  const router = useRouter();
  const { t } = useTranslation();

  const renderPrompt = ({ item }) => (
    <View style={[styles.promptCard, { borderLeftColor: item.color }]}>
      <View style={styles.promptInfo}>
        <Ionicons name={item.icon} size={24} color={item.color} />
        <ThemedText style={styles.promptText}>{t(item.tKey)}</ThemedText>
      </View>
      <ThemedButton
        style={styles.selectButton}
        onPress={() => router.push({ pathname: '/(activities)/reflections', 
          params: { prompt: item.tKey } })}
      >
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </ThemedButton>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{backgroundColor: '#f1f5eeff' }} onPress={() => router.push('/(dashboard)/activities')} />
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>
          {t('reflections.choosePrompt')}
        </ThemedText>
        <FlatList
          data={prompts}
          renderItem={renderPrompt}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.list}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1,
     backgroundColor: '#f1f5eeff' 
    },
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f1f5eeff' 
  },
  title: { 
    fontSize: 24,
    marginBottom: 16, 
    textAlign: 'center' },
  list: { 
    paddingBottom: 20 
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    //borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'space-between'
  },
  promptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promptText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
    color: '#333'
  },
  selectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});