import { useState,useEffect } from 'react';
import { StyleSheet,Text,TextInput,FlatList } from 'react-native';
import { useRouter,useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import Spacer from '../../components/Spacer';
import SplashScreen from '../../components/SplashScreen';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import { useTranslation } from '../../constants/translations';
import LanguagePicker from '../../components/LanguagePicker';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from '../../store/authStore';

export default function Reflections() {
   
  const router=useRouter()
  const { t } = useTranslation();
  const { saveReflection, getReflections } = useAuthStore();
  const [reflection, setReflection] = useState('');
  const [reflectionList, setReflectionList] = useState([]);
  const params = useLocalSearchParams();
  const prompt = params.prompt || t('reflections.defaultPrompt');
  
   useEffect(() => {
    setReflectionList(getReflections());
  }, []);

   const handleSave = () => {
    if (reflection.trim()) {
      saveReflection(reflection);
      setReflection('');
      setReflectionList(getReflections());
    }
  };

//<Image source={LogoGreen} style={styles.image}/>
  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={{ backgroundColor: '#f1f5eeff' }} onPress={() => router.push('/activities')} />
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>
          {t('reflections.title')}
        </ThemedText>

        <ThemedText style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
          {prompt}
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder={t('reflections.placeholder')}
          value={reflection}
          onChangeText={setReflection}
          multiline
        />

        <ThemedButton onPress={handleSave} style={styles.saveButton}>
          <ThemedText style={{ color: '#fff' }}>{t('reflections.save')}</ThemedText>
        </ThemedButton>

        <FlatList
          data={reflectionList}
          renderItem={({ item }) => (
            <View style={styles.reflectionItem}>
              <ThemedText style={styles.reflectionText}>{item.text}</ThemedText>
              <ThemedText style={styles.reflectionDate}>{item.date}</ThemedText>
            </View>
          )}
          keyExtractor={(item, idx) => idx.toString()}
          contentContainerStyle={styles.list}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
//<ThemedButton onPress={() => router.navigate("/(dashboard)")}>
//<ThemedButton onPress={() => router.navigate("/(auth)/register")}>
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
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
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    minHeight: 100,
    fontFamily:'MontserratZ-Regular',
  },
  saveButton: { 
    backgroundColor: '#6B73FF',
     padding: 12, 
     borderRadius: 8, 
     marginBottom: 16 
    },
  list: { 
    paddingBottom: 20 
  },
  reflectionItem: { 
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
});