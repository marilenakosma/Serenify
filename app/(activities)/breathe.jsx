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
import { useTranslation } from '../../constants/translations';
import LanguagePicker from '../../components/LanguagePicker';
import { SafeAreaView } from "react-native-safe-area-context";
export default function Breathe() {
   
  const router=useRouter()
  const { t } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isBreathing,setIsBreathing] = useState(false);
  const [breathPhase,setBreathPhase] = useState('inhale');
  const [timeRemaining,setTimeRemaining] = useState(0);
  const [progress,setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted,setIsCompleted] = useState(false);

  const animationRef = useRef(null);
  const intervalRef = useRef(null);

  const durationData = [
    { id: 1, text: t('durations.1min'), duration: 1 },
    { id: 2, text: t('durations.3min'), duration: 3 },
    { id: 3, text: t('durations.5min'), duration: 5 },
    { id: 4, text: t('durations.10min'), duration: 10 },
  ]

  const startBreathing = () => {
  if(!selectedDuration) return;
  
  setIsBreathing(true);
  setIsCompleted(false);
  setTimeRemaining(selectedDuration.duration * 60);
  setProgress(0);
  setBreathPhase('inhale');

  // Reset and start animation from beginning
  animationRef.current?.reset();
  animationRef.current?.play();
  
  // Main countdown timer
  intervalRef.current = setInterval(() => {
    setTimeRemaining(prev => {
      if(prev <= 1) {
        completeBreathing(); // Pause instead of stop when time ends
        return 0;
      }

      const totalSeconds = selectedDuration.duration * 60;
      const newProgress =((totalSeconds - prev + 1) / totalSeconds) * 100;
      setProgress(newProgress);

      return prev - 1;
    });
  }, 1000);

  // Breathing phase timer synced with animation (16 second cycles)
  const breathingCycle = () => {
    setBreathPhase('inhale');
    
     const timeouts = [
      setTimeout(() => setBreathPhase('hold'), 5000),
      setTimeout(() => setBreathPhase('exhale'), 6000),
      setTimeout(() => setBreathPhase('hold'), 11000)
    ];

    intervalRef.phaseTimeouts = (intervalRef.phaseTimeouts || []).concat(timeouts);
  };

  // Start first cycle immediately
  breathingCycle();
  
  // Repeat cycle every 14 seconds to match animation
  intervalRef.phaseInterval = setInterval(() => {
    breathingCycle();
  }, 14000);
};

  const pauseBreathing = () => {
  setIsPaused(true);
  
  //  Pause animation
  animationRef.current?.pause();
  
  //  Clear intervals but keep state
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  if (intervalRef.phaseInterval) {
    clearInterval(intervalRef.phaseInterval);
  }

  if (intervalRef.phaseTimeouts) {
    intervalRef.phaseTimeouts.forEach(timeout => clearTimeout(timeout));
    intervalRef.phaseTimeouts = [];
  }
};

const completeBreathing = () => {
  setIsCompleted(true);
  setIsPaused(false);
  
  // Stop animation
  animationRef.current?.pause();
  
  // Clear all intervals and timeouts
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  if (intervalRef.phaseInterval) {
    clearInterval(intervalRef.phaseInterval);
  }
  if (intervalRef.phaseTimeouts) {
    intervalRef.phaseTimeouts.forEach(timeout => clearTimeout(timeout));
    intervalRef.phaseTimeouts = [];
  }
  
  setBreathPhase('completed'); 
};

const resumeBreathing = () => {
  if (!isBreathing || !isPaused || isCompleted ) return;
  
  setIsPaused(false);
  
  // Resume animation from where it left off
  animationRef.current?.resume();
  
  // Restart countdown timer
  intervalRef.current = setInterval(() => {
    setTimeRemaining(prev => {
      if(prev <= 1) {
        completeBreathing();
        return 0;
      }

      const totalSeconds = selectedDuration.duration * 60;
      const newProgress =((totalSeconds - prev + 1) / totalSeconds) * 100;
      setProgress(newProgress);

      return prev - 1;
    });
  }, 1000);

  //  Resume breathing cycle from current phase
  const resumeBreathingCycle = () => {
    const breathingCycle = () => {
      setBreathPhase('inhale');
      
      const timeouts = [
        setTimeout(() => setBreathPhase('hold'), 5000),
        setTimeout(() => setBreathPhase('exhale'), 6000),
        setTimeout(() => setBreathPhase('hold'), 11000)
      ];
      intervalRef.phaseTimeouts = (intervalRef.phaseTimeouts || []).concat(timeouts);
    };

    breathingCycle();
    intervalRef.phaseInterval = setInterval(() => {
      breathingCycle();
    }, 14000);
  };

  resumeBreathingCycle();
};

const stopBreathing = () => {
  //  Complete reset - only used by back button
  setIsBreathing(false);
  setIsPaused(false);
  setIsCompleted(false);
  setTimeRemaining(0);
  setProgress(0);
  setBreathPhase('inhale');
  
  // Reset animation to beginning
  animationRef.current?.reset();
  
  // Clear intervals
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  if (intervalRef.phaseInterval) {
    clearInterval(intervalRef.phaseInterval);
  }

  if (intervalRef.phaseTimeouts) {
    intervalRef.phaseTimeouts.forEach(timeout => clearTimeout(timeout));
    intervalRef.phaseTimeouts = [];
  }

};

  const onAnimationLoop = () => {
    console.log('Breathing animation looped');
    // You can sync breathing phases with animation loops here if needed
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
   
  const handlePress = (duration) => {
    console.log('Duration selected:', duration);
    setSelectedDuration(duration);
  }
   const renderDurations = ({item}) => (
   <DurationButton
     length={item.text}
     style={styles.durationItem}
     onPress={() => handlePress(item)}
   />
  )

  

//<Image source={LogoGreen} style={styles.image}/>
 return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton 
         style={{ backgroundColor: '#f1f5eeff' }} 
         onPress={() => {
           if (isBreathing) {
            stopBreathing(); 
           }
            router.push('/(dashboard)/activities');
         }}
      />
      <ThemedView style={styles.container}>

        {!isBreathing ? (
          //  Selection Screen
          <>
            <LottieView
              ref={animationRef}
              source={require('../../assets/animations/Breathe.json')} 
              autoPlay={false}
              loop={false}
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
            
            <Spacer height={20} />
            
            {selectedDuration && (
              <ThemedButton onPress={startBreathing}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                   {t('breathe.start')} ({selectedDuration.text})
                </ThemedText>
              </ThemedButton>
            )}
          </>
        ) : (
          // Breathing Screen
          <>
            <LottieView
              ref={animationRef}
              source={require('../../assets/animations/Breathe.json')} 
              autoPlay={false}
              loop={true} // Loop during breathing
              onAnimationLoop={onAnimationLoop}
              style={styles.breathingAnimation}
            />

            {/* Breathing Phase Text */}
            <ThemedText title={true} style={styles.breathPhaseText}>
              {breathPhase === 'inhale' && t('breathe.inhale')}
              {breathPhase === 'exhale' && t('breathe.exhale')}
              {breathPhase === 'hold' && t('breathe.hold')}
              {breathPhase === 'completed' && t('breathe.completed')}
            </ThemedText>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${progress}%` }]} 
                />
              </View>
              <ThemedText style={styles.timeText}>
                {formatTime(timeRemaining)}
              </ThemedText>
            </View>

            {/* Stop Button */}
            <View style={styles.buttonContainer}>
              {isCompleted ? (
                <>
               <ThemedButton onPress={() => {
                stopBreathing();
                router.push('/(dashboard)/activities');
               }} style={styles.againButton}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                  {t('breathe.finish')}
                </ThemedText>
              </ThemedButton>

              <ThemedButton onPress={() => {
                stopBreathing();
               }} style={styles.finishButton}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                  {t('breathe.again')}
                </ThemedText>
              </ThemedButton>
               </>
              
            ): !isPaused ? (
              <ThemedButton onPress={pauseBreathing} style={styles.pauseButton}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                  {t('breathe.pause')}
                </ThemedText>
              </ThemedButton>
              ) : (
              <ThemedButton onPress={resumeBreathing} style={styles.resumeButton}>
                <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                 {t('breathe.resume')}
             </ThemedText>
            </ThemedButton>
            )}
           </View>
          </>
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
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#f1f5eeff',
        paddingHorizontal: 20,
    },
    safeArea:{
        flex:1,
        backgroundColor:'#f1f5eeff'
    },
    animation: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
    title: {
        fontSize: 25,
        marginTop: 20,
        textAlign: 'center',
         },
    subtitle: {
        fontSize: 16,
    },
    link: {
        marginVertical: 10,
        borderBottomWidth:1
    },
    durationContainer: {
      width: '60%',
      marginBottom: 30,
    },
    durationItem: {
     flex: 1,
     height:80,
     marginHorizontal: 5,
  },
   grid: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  breathingAnimation: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  breathPhaseText: {
    fontSize: 32,
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 30,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
  },
  stopButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 30,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    marginHorizontal: 5,
  },
  againButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    marginHorizontal: 5,
  },
})