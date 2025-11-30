import { useState,useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter} from 'expo-router';
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

export default function goalIdeas() {
   
  const router=useRouter()
  const { t } = useTranslation();

//<Image source={LogoGreen} style={styles.image}/>
  return (
      <SafeAreaView style={styles.safeArea}>
       <BackButton style={{backgroundColor:'#f1f5eeff'}}/>
       <ThemedView style={styles.container}>
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
      </SafeAreaView>
  );
}
//<ThemedButton onPress={() => router.navigate("/(dashboard)")}>
//<ThemedButton onPress={() => router.navigate("/(auth)/register")}>
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#f1f5eeff'
    },
    safeArea:{
        flex:1,
        backgroundColor:'#f1f5eeff'
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