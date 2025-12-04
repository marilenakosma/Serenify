import { useState,useEffect,useRef } from 'react';
import { StyleSheet,FlatList,View } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Spacer from '../../components/Spacer';
import SplashScreen from '../../components/SplashScreen';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import BackButton from "../../components/BackButton";
import DurationButton from "../../components/DurationButton";
import ActivitySession from "../../components/ActivitySession";
import { useTranslation } from '../../constants/translations';
import LanguagePicker from '../../components/LanguagePicker';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Timers() {
   
  const router=useRouter()
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showSession,setShowSession ] = useState(false);
  const [meditationPhase,setMeditationPhase] = useState('inhale');

  const durationData = [
    { id: 1, text: t('durations.5min'), duration: 5 },
    { id: 2, text: t('durations.10min'), duration: 10 },
    { id: 3, text: t('durations.15min'), duration: 15 },
    { id: 4, text: t('durations.20min'), duration: 20 },
  ]

const handleAnimationFrame = (event) => {
 const progress = event.progress;

 console.log('Meditation progress:', progress);

 if (progress < 0.25) {
      setMeditationPhase('focus');     
    } else if (progress < 0.50) {
      setMeditationPhase('observe');   
    } else if (progress < 0.75) {
      setMeditationPhase('release');   
    } else {
      setMeditationPhase('return');    
    }
  };

const getPhaseText = () => {
    switch(meditationPhase) {
      case 'focus': return t('meditation.focus');
      case 'observe': return t('meditation.observe');
      case 'release': return t('meditation.release');
      case 'return': return t('meditation.return');
      default: return t('meditation.focus');
    }
  };

   const renderDurations = ({item}) => (
   <DurationButton
     length={item.text}
     style={styles.durationItem}
     onPress={() => handlePress(item)}
   />
  )

  const handleStop = () => {
    setSelectedDuration(null);
    setShowSession(false);
    setBreathPhase('focus');
  };

  const handleStartSession = () => {
    setShowSession(true);
  }

   const handlePress = (duration) => {
    console.log('Duration selected:', duration);
    setSelectedDuration(duration);
  }

 return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton 
         style={{ backgroundColor: '#f1f5eeff' }} 
         onPress={() => {
          handleStop();
          router.push('activities');
        }}
      />
      <ThemedView style={styles.container}>

       
    {!showSession ? (

          <View style={styles.selectionContent}>
          
          <ThemedText title={true} style={styles.title}>
            {t('meditation.title')}
          </ThemedText>

          <LottieView
            source={require('../../assets/animations/Meditation.json')} 
            autoPlay={true}
            loop={true}
            style={styles.animation}
          />

          <ThemedText title={true} style={styles.durationText}>
            {t('activities.selectDuration')}
          </ThemedText>

            <View style={styles.durationContainer}>
              <FlatList
                data={durationData}
                renderItem={renderDurations}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
              />
            </View>

            {selectedDuration && (
              <View style={styles.buttonContainer}>
              <ThemedButton onPress={handleStartSession}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                   {t('activities.start')} ({selectedDuration.text})
                </ThemedText>
              </ThemedButton>
              </View>
            )}

            </View>
            

        ) : (
          <ActivitySession
            animationSource={require('../../assets/animations/Meditation.json')}
            //onPhaseChange={handleBreathingPhases}
            onAnimationFrame={handleAnimationFrame}
            phaseText={getPhaseText()}
            backRoute="/(dashboard)/activities"
            selectedDuration={selectedDuration}
            onStop={handleStop}
            autoStart={true}
            cycleDuration={30000}
            startButtonText={t('activities.start')}
            showProgress={true}
            completedText={t('meditation.completed')}
            finishButtonText={t('activities.finish')}
            againButtonText={t('activities.again')}
            pauseButtonText={t('activities.pause')}
            resumeButtonText={t('activities.resume')}
          />
        )}

      </ThemedView>
    </SafeAreaView>
  );

}
//<ThemedButton onPress={() => router.navigate("/(dashboard)")}>
//<ThemedButton onPress={() => router.navigate("/(auth)/register")}>
const styles = StyleSheet.create({
    container: {
        flex:1,
        //alignItems:'stretch',
        justifyContent:'center',
        backgroundColor:'#f1f5eeff',
        paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 30,
    },
    safeArea:{
        flex:1,
        backgroundColor:'#f1f5eeff'
    },
    selectionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
    animation: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
    durationContainer: {
      alignItems:'center',
      width: '80%',
      marginBottom: 30,
    },
    durationItem: {
     marginHorizontal: 5,
  },
   grid: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  durationText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 10,
    paddingHorizontal:10,
    alignItems: 'center',
    justifyContent:'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 25,
  },
  changeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButton: {
    backgroundColor: '#6B73FF', 
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 25,
  },
})