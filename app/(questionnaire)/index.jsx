import { router, useRouter,useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useAuthStore } from '../../store/authStore';
import { getItem } from '../../store/storage';

const Questionnaire = () => {
    const {user,isRetakingQuestionnaire} = useAuthStore();
    const router=useRouter();
    const params = useLocalSearchParams();

    const existingQuestionnaire = getItem(`questionnaire_${user?.id}`);
 /*
    console.log('🐛 Debug Everything:', {
        userId: user?.id,
        params: params,
        allKeys: Object.keys(params),
        paramCount: Object.keys(params).length,
        retakeFromParams: params.retake,
        testFromParams: params.test,
        retakeFromStore: isRetakingQuestionnaire, 
        existingQuestionnaire: existingQuestionnaire,
        currentPath: router.pathname
    });
*/
    const isReturningUser = !!existingQuestionnaire || isRetakingQuestionnaire;
    
    const handleStartQuiz = () => {
      router.navigate("questions");
    }


 return (
    <View style={{flex:1}} >

        <SafeAreaView style={{backgroundColor:Colors.background}}>        
        </SafeAreaView>

        <ThemedView style={styles.container}>

        <ThemedText title={true} 
        style={styles.title}> {isReturningUser ? "Welcome Back!" : "Welcome to Serenify" }
        </ThemedText>

          <LottieView
                source={require('../../assets/animations/Dog.json')} 
                autoPlay
                loop={true}
                style={styles.animation}
              />
       
        <ThemedText style={styles.description}> 
                    {isReturningUser ?
                             "It looks like you've used Serenify before. Let's update your preferences!" 
                        : "We would like to begin by asking you a few questions"}
                </ThemedText>

       <ThemedButton onPress={handleStartQuiz}>
          <ThemedText title={true} 
          style={{color:'#f2f2f2'}}>
            {isReturningUser ? "Update Preferences" : "Start Quiz"}</ThemedText>
        </ThemedButton>

     </ThemedView>
     </View>

     
   )
}

export default Questionnaire

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