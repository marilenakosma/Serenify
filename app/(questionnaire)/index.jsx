import { router, useRouter,useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import {useTranslation} from "../../constants/translations"
import { useAuthStore } from '../../store/authStore';
import { getItem } from '../../store/storage';

const Questionnaire = () => {
    const { user, hasCompletedQuestionnaire } = useAuthStore();
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams();

    // Fix: Get retake from params properly
    const isRetake = params.retake === 'true';

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
    
    const handleStartQuiz = () => {
      router.navigate("questions");
    }


 return (
    <View style={{flex:1}} >

        <SafeAreaView style={{backgroundColor:Colors.background}}>        
        </SafeAreaView>

        <ThemedView style={styles.container}>

        <ThemedText title style={styles.title}>
          {hasCompletedQuestionnaire && !isRetake 
            ? t('questionnaire.welcomeBack') 
            : t('questionnaire.welcome')
          }
        </ThemedText>

          <LottieView
                source={require('../../assets/animations/Dog.json')} 
                autoPlay
                loop={true}
                style={styles.animation}
              />
       
        <ThemedText style={styles.description}>
          {t('questionnaire.description')}
        </ThemedText>

       <ThemedButton onPress={handleStartQuiz} style={styles.button}>
                    <ThemedText style={styles.buttonText}>
                        {hasCompletedQuestionnaire && !isRetake 
                            ? t('questionnaire.continue')
                            : t('questionnaire.startQuiz')
                        }
                    </ThemedText>
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