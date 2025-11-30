import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from '../../constants/translations';

const prompts = [
  { key: 'energy', text: 'What gave you energy today?' },
  { key: 'drain', text: 'What drained your energy today?' },
  { key: 'gratitude', text: 'What do you feel grateful for?' },
  { key: 'mind', text: "What's on your mind?" },
  { key: 'free', text: 'Write anything you want.' }
];

export default function ReflectionPrompts() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5eeff' }}>
      <BackButton onPress={() => router.push('/(dashboard)/activities')} />
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText title={true} style={{ fontSize: 24, marginBottom: 16, textAlign: 'center' }}>
          {t('reflections.choosePrompt')}
        </ThemedText>
        <FlatList
          data={prompts}
          renderItem={({ item }) => (
            <ThemedButton
              style={{ marginBottom: 12, backgroundColor: '#6B73FF', borderRadius: 8, padding: 16 }}
              onPress={() => router.push({ pathname: '/(activities)/reflections', params: { prompt: item.text } })}
            >
              <ThemedText style={{ color: '#fff', fontSize: 16 }}>{item.text}</ThemedText>
            </ThemedButton>
          )}
          keyExtractor={item => item.key}
        />
      </ThemedView>
    </SafeAreaView>
  );
}