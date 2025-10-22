import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { quizData } from '../../constants/quizData';

const Questions = () => {
     const [answers, setAnswers] = useState({});
     const [currentQuestion, setCurrentQuestion] =
		useState(0);
     const [quizCompleted, setQuizCompleted] =
		useState(false);

     const router=useRouter()
     
     const handleAnswer = (selectedOption, index) => {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestion]: {
          question: quizData[currentQuestion].question,
          selectedAnswer: selectedOption,
          optionIndex: index
        }
      }));

      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
     }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {quizData[currentQuestion].question}               
      </ThemedText>

      <Spacer height={20}/>

      {quizData[currentQuestion].options.map((option, index) => (
			<TouchableOpacity key={index}
							style={styles.option}
							onPress={() => handleAnswer(option,index)}
              >
                  
	      <ThemedText style={styles.text}>{option}</ThemedText>

			</TouchableOpacity>
						))}

      {quizCompleted ? <ThemedButton onPress={() => router.navigate("/(dashboard)")}>
        <ThemedText style={{color:'#f2f2f2'}}>Go to Dashboard</ThemedText>
      </ThemedButton> : null }

    </ThemedView>
  )
  
}



export default Questions

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        textAlign:"center",
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:10
    },
    option: {
		   backgroundColor: Colors.tabGroupBackground,
		   padding: 10,
		   marginBottom: 10,
		   alignItems: 'center',
       color: '#31362bff',
       borderRadius:5
	},
  text: {
    fontSize: 16,
    color: Colors.primary
  },
    btn: {
        backgroundColor:Colors.primary,
        padding:15,
        borderRadius:5
    },
    pressed: {
        opacity:0.8
    }
})