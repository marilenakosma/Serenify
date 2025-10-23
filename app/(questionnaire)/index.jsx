import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";

const index = () => {
    const router=useRouter()
 return (
    <View style={{flex:1}} >

        <SafeAreaView style={{backgroundColor:Colors.background}}>
          <BackButton/>
        </SafeAreaView>

        <ThemedView style={styles.container}>

        <ThemedText title={true} 
        style={styles.title}>Welcome to Serenify
        </ThemedText>

          <LottieView
                source={require('../../assets/animations/Dog.json')} 
                autoPlay
                loop={true}
                style={styles.animation}
              />
       
        <ThemedText style={styles.description}> 
          We would like to begin by asking you a few questions
        </ThemedText>

       <ThemedButton onPress={() => 
        router.navigate("questions")}>
          <ThemedText title={true} 
          style={{color:'#f2f2f2'}}>Start Quiz</ThemedText>
        </ThemedButton>

     </ThemedView>
     </View>

     
   )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        paddingBottom: 80,
    },
    title: {
        textAlign:"center",
        fontSize: 27,
        marginBottom:10,
        paddingHorizontal: 16,
    },
    animation: {
    width: 400,
    height: 400,
  },
  description: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
})