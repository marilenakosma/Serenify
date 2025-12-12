import { useState,useEffect,useRef } from 'react';
import { StyleSheet,FlatList,View,Alert } from 'react-native';
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
import { useAuthStore } from '../../store/authStore';
import { showPointsAlert } from '../utils/customAlert';

export default function Breathe() {
   
  const router=useRouter()
  const { t } = useTranslation();
  const { addPoints } = useAuthStore();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showSession,setShowSession ] = useState(false);
  const [breathPhase,setBreathPhase] = useState('inhale');

  const durationData = [
    { id: 1, text: t('durations.1min'), duration: 1 },
    { id: 2, text: t('durations.3min'), duration: 3 },
    { id: 3, text: t('durations.5min'), duration: 5 },
    { id: 4, text: t('durations.10min'), duration: 10 },
  ]

const handleAnimationFrame = (event) => {
 const progress = event.progress;

 //console.log('Animation progress:', progress);

 if(progress < 0.37) {
    setBreathPhase('inhale');
 } else if(progress < 0.43) {
    setBreathPhase('hold');
 } else if(progress < 0.77) {
    setBreathPhase('exhale');
 } else {
    setBreathPhase('hold');
 }
};

const getPhaseText = () => {
    switch(breathPhase) {
      case 'inhale': return t('breathe.inhale');
      case 'exhale': return t('breathe.exhale');
      case 'hold': return t('breathe.hold');
      default: return t('breathe.inhale');
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
  if (selectedDuration && showSession) {
    const pointsToAward = selectedDuration.duration * 5;
    addPoints(pointsToAward, 'breathe-activity');
    
    showPointsAlert(pointsToAward);
  }
  
  setSelectedDuration(null);
  setShowSession(false);
  setBreathPhase('inhale');
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
          router.replace('/(dashboard)/activities');
        }}
      />
      <ThemedView style={styles.container}>

       
    {!showSession ? (

          <View style={styles.selectionContent}>

          <ThemedText title={true} style={styles.title}>
                {t('breathe.title')}
            </ThemedText>

          <LottieView
            source={require('../../assets/animations/Breathe.json')} 
            autoPlay={false}
            //loop={true}
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
            animationSource={require('../../assets/animations/Breathe.json')}
            //onPhaseChange={handleBreathingPhases}
            onAnimationFrame={handleAnimationFrame}
            phaseText={getPhaseText()}
            backRoute="/(dashboard)/activities"
            selectedDuration={selectedDuration}
            onStop={handleStop}
            autoStart={true}
            cycleDuration={16000}
            startButtonText={t('activities.start')}
            showProgress={true}
            completedText={t('breathe.completed')}
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
})