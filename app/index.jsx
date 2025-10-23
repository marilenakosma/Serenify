import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import LogoGreen from "../assets/images/leaf-green.png";
//import LogoBeige from "../assets/images/leaf-beige.png";
import { Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import Spacer from '../components/Spacer';
import SplashScreen from '../components/SplashScreen';
import ThemedButton from '../components/ThemedButton';
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold
  });
   
  const [showSplash, setShowSplash] = useState(true);
  const router=useRouter()

  if (!fontsLoaded || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={LogoGreen} style={styles.image}/>
      <ThemedText title={true} style={styles.title}>
        Serenify
      </ThemedText>
      
      <Spacer height={20}/>
      
      <ThemedButton onPress={() => router.navigate("/(auth)/register")}>
        <ThemedText style={{color:'#f2f2f2'}}>Get Started</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
}

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
    title: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'Montserrat_600SemiBold'
         },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})
