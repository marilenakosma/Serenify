import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import BootSplash from 'react-native-bootsplash';
import Spacer from '../components/Spacer';
import SplashScreen from '../components/SplashScreen';
import ThemedButton from '../components/ThemedButton';
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { useTranslation } from '../constants/translations';
import LanguagePicker from '../components/LanguagePicker';

export default function Index() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Hide BootSplash immediately and show custom Lottie splash
    const init = async () => {
      await BootSplash.hide({ fade: true, duration: 300 });
    };
    
    init();
  }, []);

  const handleSplashFinish = () => {
    setShowCustomSplash(false);
  };

  if (showCustomSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  
  return (
    <ThemedView style={styles.container}>
      <LanguagePicker />
      <LottieView
        source={require('../assets/animations/MapleLeaves.json')} 
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <ThemedText title={true} style={styles.title}>
        {t('welcome.title')}
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        {t('welcome.subtitle')}
      </ThemedText>
      
      <Spacer height={20}/>
      
      <ThemedButton onPress={() => router.navigate("/(auth)/register")}>
        <ThemedText title={true} style={{color:'#f2f2f2'}}>
          {t('welcome.getStarted')}
        </ThemedText>
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 25,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
  },
});
