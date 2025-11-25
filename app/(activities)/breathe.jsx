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

export default function Breathe() {
   
  const router=useRouter()
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [ showSession,setShowSession ] = useState(false);
  const [breathPhase,setBreathPhase] = useState('inhale');

  const durationData = [
    { id: 1, text: t('durations.1min'), duration: 1 },
    { id: 2, text: t('durations.3min'), duration: 3 },
    { id: 3, text: t('durations.5min'), duration: 5 },
    { id: 4, text: t('durations.10min'), duration: 10 },
  ]
  
  const handleBreathingPhases = (setPhaseTimeouts, setPhaseInterval) => {
    const breathingCycle = () => {
      setBreathPhase('inhale');
      
      const timeouts = [
        setTimeout(() => setBreathPhase('hold'), 5000),
        setTimeout(() => setBreathPhase('exhale'), 6000),
        setTimeout(() => setBreathPhase('hold'), 11000)
      ];

      setPhaseTimeouts(timeouts);
    };

    breathingCycle();
    const interval = setInterval(breathingCycle, 14000);
    setPhaseInterval(interval);
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
          router.push('/(dashboard)/activities');
        }}
      />
      <ThemedView style={styles.container}>

       
    {!selectedDuration ? (
          // Duration Selection Screen

          <View style={styles.selectionContent}>
          <LottieView
            source={require('../../assets/animations/Breathe.json')} 
            autoPlay={false}
            loop={true}
            style={styles.animation}
          />

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
            </View>
        ) : !showSession ? (

          <View style={styles.selectionContent}>
            <LottieView
              source={require('../../assets/animations/Breathe.json')} 
              autoPlay={true}
              loop={true}
              style={styles.animation}
            />

            <ThemedText title={true} style={styles.title}>
              {t('breathe.ready')}
            </ThemedText>

            <ThemedText style={styles.durationText}>
              {t('breathe.duration')}: {selectedDuration.text}
            </ThemedText>

            <View style={styles.buttonContainer}>
              <ThemedButton onPress={handleStartSession} style={styles.startButton}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                  {t('breathe.start')}
                </ThemedText>
              </ThemedButton>

              <ThemedButton 
                onPress={() => setSelectedDuration(null)} 
                style={styles.changeButton}
              >
                <ThemedText title={true} style={{ color: '#4CAF50' }}>
                  {t('breathe.changeDuration')}
                </ThemedText>
              </ThemedButton>
            </View>
          </View>
        ) : (
          <ActivitySession
            animationSource={require('../../assets/animations/Breathe.json')}
            onPhaseChange={handleBreathingPhases}
            phaseText={getPhaseText()}
            backRoute="/(dashboard)/activities"
            selectedDuration={selectedDuration}
            onStop={handleStop}
            autoStart={true}
            startButtonText={t('breathe.start')}
            showProgress={true}
            completedText={t('breathe.completed')}
            finishButtonText={t('breathe.finish')}
            againButtonText={t('breathe.again')}
            pauseButtonText={t('breathe.pause')}
            resumeButtonText={t('breathe.resume')}
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
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
    alignItems: 'center',
    justifyContent:'center'
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