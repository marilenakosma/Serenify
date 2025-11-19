import { useEffect,useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import LottieView from 'lottie-react-native';
import { useTranslation } from '../../constants/translations';

const results = () => {
    const router = useRouter();
    const { finishShowingResults, questionnaireResults,updateUser } = useAuthStore();
    const [analysis, setAnalysis] = useState(null);
    const { t } = useTranslation();
    
    const getTranslatedFocusArea = (englishFocusArea) => {
        const focusAreaMap = {
            'Anxiety Management': t('questionnaire.focusAreas.anxietyManagement'),
            'Stress Relief': t('questionnaire.focusAreas.stressRelief'),
            'Maintaining Balance': t('questionnaire.focusAreas.maintainingBalance'),
            'General Wellness': t('questionnaire.focusAreas.generalWellness')
        };
        return focusAreaMap[englishFocusArea] || englishFocusArea;
    };

    // Simple analysis of quiz answers
    useEffect(() => {
        if (questionnaireResults?.answers) {
            //We need to convert the object to an array

/*questionnaireResults.answers = {
  0: {
    question: "What can we help you to do?",
    selectedAnswer: "Reduce stress and anxiety",
    optionIndex: 0
  }, => const answers = [
  {
    question: "What can we help you to do?",
    selectedAnswer: "Reduce stress and anxiety",
    optionIndex: 0
  }, */
 
            const answers = Object.values(questionnaireResults.answers);
            //console.log(answers)
            //console.log(questionnaireResults.answers)
            //// Converts: { 0: {selectedAnswer: "Anxious"}, 1: {selectedAnswer: "Good"} }
            // To: [{selectedAnswer: "Anxious"}, {selectedAnswer: "Good"}]
            
            // Count keywords in responses 
            let anxietyCount = 0;
            let stressCount = 0;
            let positiveCount = 0;
            let adhdCount = 0;

            answers.forEach(answer => {
                const response = answer.selectedAnswer.toLowerCase();
                if (response.includes('reduce stress and anxiety')) {
                anxietyCount++;
                stressCount++;
            } else if (response.includes('boost focus and manage adhd')) {
                adhdCount++;
            }
            
            // Question 2: Topics that make it harder to feel confident
            if (response.includes('managing emotions')) {
                anxietyCount++;
            } else if (response.includes('energy levels')) {
                stressCount++;
            }
            
            // Question 3: Getting out of bed
            if (response.includes('very easy')) {
                positiveCount++;
            } else if (response.includes('sometimes easy')) {
                stressCount++;
            } else if (response.includes('hard') && response.includes('struggle')) {
                anxietyCount++;
            }
            
            // Question 4: Feeling overwhelmed
            if (response.includes('overwhelmed several times')) {
                stressCount += 2; // Weight this more heavily
            } else if (response.includes('few stressful days')) {
                stressCount++;
            } else if (response.includes('manage and overcome')) {
                positiveCount++;
            }
            
            // Question 5: Mental health challenges
            if (response.includes('anxiety')) {
                anxietyCount += 2; // Weight this heavily
            } else if (response.includes('adhd')) {
                adhdCount += 2;
            } else if (response.includes('ptsd') || response.includes('bipolar') || response.includes('ocd')) {
                anxietyCount++;
            } else if (response.includes('none of the above')) {
                positiveCount++;
            }
            });

            // Determine primary focus area
            let focusArea = "General Wellness";
            let focusEmoji = "🌱";
            if (anxietyCount > stressCount && anxietyCount > 0) {
                focusArea = "Anxiety Management";
                focusEmoji = "🧘‍♀️";
            } else if (stressCount > 0) {
                focusArea = "Stress Relief";
                focusEmoji = "😌";
            } else if (positiveCount > 2) {
                focusArea = "Maintaining Balance";
                focusEmoji = "⚖️";
            }
            
            const analysisResult = {
                focusArea, 
                focusAreaTranslated: getTranslatedFocusArea(focusArea), 
                focusEmoji,
                anxietyCount,
                stressCount,
                positiveCount
            };
            setAnalysis(analysisResult);

            updateUser({ focusArea,focusEmoji })
        }
    }, [questionnaireResults]);

    const handleContinue = () => {
        finishShowingResults();
        router.replace("/(dashboard)");
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.content}>
                <ThemedText title={true} style={styles.title}>
                    {t('questionnaire.quizComplete')}
                </ThemedText>

                <LottieView
                    source={require('../../assets/animations/AnimatedBird.json')} 
                    autoPlay
                    loop={true}
                    style={styles.animation}
                />

                {analysis && (
                    <ThemedView style={styles.analysisCard}>
                        <ThemedText title={true} style={styles.analysisTitle}>
                            {t('questionnaire.yourFocusArea')}: {analysis.focusEmoji}
                        </ThemedText>
                        <ThemedText title={true} style={styles.analysisText}>
                            {analysis.focusAreaTranslated}
                        </ThemedText>
                        <ThemedText style={styles.analysisSubtext}>
                           {t('questionnaire.personalizedMessage')}
                        </ThemedText>
                    </ThemedView>
                )}

                <ThemedText style={styles.subtitle}>
                    {t('questionnaire.journeyStartsNow')}
                </ThemedText>

                <ThemedButton 
                    onPress={handleContinue}
                    style={styles.button}
                >
                    <ThemedText title={true} style={styles.buttonText}>
                        {t('questionnaire.viewDashboard')}
                    </ThemedText>
                </ThemedButton>
            </SafeAreaView>
        </ThemedView>
    );
};

export default results

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
   title: {
        textAlign:"center",
        fontSize: 25,
        marginBottom:5,
        paddingHorizonal: 10,
    },
    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 26,
    },
    button: {
        width: '100%',
    },
    buttonText: {
        color: '#f2f2f2',
        fontSize: 16,
    },
    animation: {
    width: 400,
    height: 400,
    marginBottom: -90,
  },
  analysisCard: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        padding: 20,
        marginVertical: 20,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    analysisTitle: {
        fontSize: 18,
        color: '#2c3e50',
        marginBottom: 8,
    },
    analysisText: {
        fontSize: 20,
        color: '#4CAF50',
        marginBottom: 8,
    },
    analysisSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
});