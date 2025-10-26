import { useState } from 'react';
import { StyleSheet } from 'react-native';
//import LogoGreen from "../assets/images/leaf-green.png";
//import LogoBeige from "../assets/images/leaf-beige.png";
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Spacer from '../components/Spacer';
import SplashScreen from '../components/SplashScreen';
import ThemedButton from '../components/ThemedButton';
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function Index() {
   
  const [showSplash, setShowSplash] = useState(true);
  const router=useRouter()


  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
//<Image source={LogoGreen} style={styles.image}/>
  return (
    <ThemedView style={styles.container}>
       <LottieView
              source={require('../assets/animations/MapleLeaves.json')} 
              autoPlay
              loop={false}
              style={styles.animation}
            />
      <ThemedText title={true} style={styles.title}>
        Serenify
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Find your inner peace...
      </ThemedText>
      
      <Spacer height={20}/>
      
      <ThemedButton onPress={() => router.navigate("/(auth)/register")}>
        <ThemedText title={true} style={{color:'#f2f2f2'}}>Get Started</ThemedText>
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
        fontFamily: 'Montserrat_600SemiBold'
         },
    subtitle: {
        fontSize: 16,
    },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    }
})
