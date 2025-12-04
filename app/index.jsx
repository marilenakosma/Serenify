import { useState } from 'react';
import { StyleSheet } from 'react-native';
//import LogoGreen from "../assets/images/leaf-green.png";
//import LogoBeige from "../assets/images/leaf-beige.png";
import { useRouter,useEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import Spacer from '../components/Spacer';
import SplashScreen from '../components/SplashScreen';
import ThemedButton from '../components/ThemedButton';
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { useTranslation } from '../constants/translations';
import LanguagePicker from '../components/LanguagePicker';

export default function Index() {
   
  const [showSplash, setShowSplash] = useState(true);
  const router=useRouter()
  const { t } = useTranslation();
  
  //if (showSplash) {
  //  return <SplashScreen onFinish={() => setShowSplash(false)} />;
 // } 
//<Image source={LogoGreen} style={styles.image}/>
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
//<ThemedButton onPress={() => router.navigate("/(dashboard)")}>
//<ThemedButton onPress={() => router.navigate("/(auth)/register")}>
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        marginVertical: 20,
        width:220,
        height:220
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
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})
