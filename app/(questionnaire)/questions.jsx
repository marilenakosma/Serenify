import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import Spacer from "../../components/Spacer";
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { quizData } from '../../constants/quizData';

const Questions = () => {
     const [answers, setAnswers] = useState({});
     const [currentQuestion, setCurrentQuestion] = useState(0);
     const [selectedOption, setSelectedOption] = useState(null);
     const [quizCompleted, setQuizCompleted] = useState(false);

     const router = useRouter();
     
     const handleAnswerSelection = (selectedAnswer, index) => {
       setSelectedOption(index); // Just highlight the selection
     }

     const handleNext = () => {
       if (selectedOption === null) return; // Don't proceed if no answer selected

       // Save the answer
       setAnswers(prevAnswers => ({
         ...prevAnswers,
         [currentQuestion]: {
           question: quizData[currentQuestion].question,
           selectedAnswer: quizData[currentQuestion].options[selectedOption],
           optionIndex: selectedOption
         }
       }));

       // Reset selection for next question
       setSelectedOption(null);

       // Navigate to next question or complete quiz
       if (currentQuestion < quizData.length - 1) {
         setCurrentQuestion(currentQuestion + 1);
       } else {
         setQuizCompleted(true);
       }
     }

     // Calculate progress
     const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <ThemedView style={{flex:1}}>
      <SafeAreaView style={{backgroundColor:Colors.background}}>
          <BackButton/>
      </SafeAreaView>
        
      <ThemedView style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {currentQuestion + 1} of {quizData.length}
          </ThemedText>
        </View>

        <Spacer height={30}/>

        <ThemedText title={true} style={styles.title}>
          {quizData[currentQuestion].question}               
        </ThemedText>
        <Spacer height={20}/>

        {quizData[currentQuestion].options.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.option,
              selectedOption === index && styles.selectedOption
            ]}
            onPress={() => handleAnswerSelection(option, index)}
          >
            <ThemedText style={styles.text}>{option}</ThemedText>
          </TouchableOpacity>
        ))}

        <Spacer height={30}/>

        {!quizCompleted ? (
          <ThemedButton 
            onPress={handleNext}
            style={[
              styles.nextButton, 
              selectedOption === null && styles.disabledButton
            ]}
          >
            <ThemedText style={{color:'#f2f2f2'}}>
            Next
            </ThemedText>
          </ThemedButton>
        ) : (
          <ThemedButton onPress={() => router.navigate("/(dashboard)")}>
            <ThemedText style={{color:'#f2f2f2'}}>Go to Dashboard</ThemedText>
          </ThemedButton>
        )}

      </ThemedView>
    </ThemedView>
  )
}



export default Questions

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    progressText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.text,
    },
    title: {
        textAlign:"center",
        fontSize: 25,
        marginBottom:10,
        paddingHorizontal: 10,
    },
    option: {
		   backgroundColor: Colors.tabGroupBackground,
		   padding: 15,
		   marginBottom: 10,
		   alignItems: 'center',
       borderRadius:5,
       borderColor:'#31362bff',
       borderWidth:0.2,
       width: '100%',
       minHeight: 50,
	},
  selectedOption: {
        borderColor: Colors.primary, 
        borderWidth: 2,
        backgroundColor: '#f0f8f0', 
    },
  text: {
    fontSize: 16,
    color: '#31362bff',
    textAlign: 'center',
  },
    nextButton: {
        minWidth: 120,
    },
    disabledButton: {
        opacity: 0.5,
    },
})