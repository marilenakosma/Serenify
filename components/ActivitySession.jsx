import React, { useRef, useState,useEffect } from 'react';
import { View, StyleSheet,Animated,Easing } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import { useActivityTimer } from '../hooks/useActivityTimer';
import { useTranslation } from '../constants/translations';
import { Confetti, ConfettiMethods,ContinuousConfetti } from 'react-native-fast-confetti';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const ActivitySession = ({ 
    animationSource,
    onAnimationFrame,
    phaseText,
    backRoute,
    animationStyle,
    cycleDuration = 16000,
    showProgress = true,
    autoStart = false,
    startButtonText = "Start",
    completedText = "Well Done! 🌟",
    pointsEarnedText,
    finishButtonText = "Finish",
    againButtonText = "Again",
    pauseButtonText = "Pause",
    resumeButtonText = "Resume",
    selectedDuration,
    onStop,
    onComplete,
}) => {
  const router = useRouter();
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [animationActive, setAnimationActive] = useState(false);
  const confettiRef = useRef(null); 
  //const [position,setPosition]

  const {
    isActive,
    isPaused,
    isCompleted,
    timeRemaining,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useActivityTimer();

  // SINGLE useEffect to handle animation loop
  useEffect(() => {
    if (!animationActive) return;

    let isCancelled = false;
    
    const runLoop = async () => {
      while (!isCancelled && animationActive) {
        // Reset to start
        animationProgress.setValue(0);
        
        // Run animation for one cycle
        await new Promise((resolve) => {
          Animated.timing(animationProgress, {
            toValue: 1,
            duration: cycleDuration,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start(({ finished }) => {
            resolve(finished);
          });
        });
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
      animationProgress.stopAnimation();
    };
  }, [animationActive, cycleDuration]);

  //  Animation frame listener
  useEffect(() => {
    const listenerId = animationProgress.addListener(({ value }) => {
      if (onAnimationFrame && animationActive) {
        onAnimationFrame({ progress: value });
      }
    });

    return () => {
      animationProgress.removeListener(listenerId);
    };
  }, [onAnimationFrame, animationActive]);

  const handleStart = () => {
    setAnimationActive(true);
    startTimer(selectedDuration.duration, handleComplete);
  };

  const handlePause = () => {
    setAnimationActive(false);
    pauseTimer();
  };

  const handleResume = () => {
    setAnimationActive(true);
    resumeTimer(selectedDuration.duration, handleComplete);
  };

  const handleComplete = () => {
    setAnimationActive(false);
    animationProgress.setValue(0);
    confettiRef.current?.start();
    onComplete?.();
  };

  const handleStop = () => {
    setAnimationActive(false);
    animationProgress.setValue(0);
    stopTimer();
    onStop?.();
  };

  const handleFinish = () => {
    handleStop();
    router.push(backRoute);
  };

  const handleAgain = () => {
    handleStop();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (selectedDuration && !isActive && autoStart) {
      handleStart();
    }
  }, [selectedDuration, autoStart]);

  return (
    <View style={styles.container}>
      {/* Use AnimatedLottieView with progress control */}

      {isCompleted && (
        <ContinuousConfetti/>
      )}

      <AnimatedLottieView
        source={animationSource}
        progress={animationProgress}
        style={[styles.animation, animationStyle]}
      />

      {/* Completion text at top when done, phase text during activity */}
      {isCompleted && (
        <ThemedText title={true} style={styles.completedTitle}>
          {completedText}
        </ThemedText>
      )}

      {/* Points earned text in center when completed, phase text during activity */}
      <ThemedText title={true} style={styles.phaseText}>
        {isCompleted ? (pointsEarnedText || '') : phaseText}
      </ThemedText>
      
      {showProgress && !isCompleted && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.timeText}>
            {formatTime(timeRemaining)}
          </ThemedText>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!isActive && !isCompleted ? (
          <ThemedButton onPress={handleStart} style={styles.startButton}>
            <ThemedText title={true} style={{ color: '#f2f2f2' }}>
              {startButtonText} ({selectedDuration?.text})
            </ThemedText>
          </ThemedButton>
        ) : isCompleted ? (
          <>
            <ThemedButton onPress={handleFinish} style={styles.finishButton}>
              <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                {finishButtonText}
              </ThemedText>
            </ThemedButton>
            <ThemedButton onPress={handleAgain} style={styles.againButton}>
              <ThemedText title={true} style={{ color: '#f2f2f2' }}>
                {againButtonText}
              </ThemedText>
            </ThemedButton>
          </>
        ) : !isPaused ? (
          <ThemedButton onPress={handlePause} style={styles.pauseButton}>
            <ThemedText title={true} style={{ color: '#f2f2f2' }}>
              {pauseButtonText}
            </ThemedText>
          </ThemedButton>
        ) : (
          <ThemedButton onPress={handleResume} style={styles.resumeButton}>
            <ThemedText title={true} style={{ color: '#f2f2f2' }}>
              {resumeButtonText}
            </ThemedText>
          </ThemedButton>
        )}
      </View>
    </View>
  );
};
   
  
//<ThemedButton onPress={() => router.navigate("/(dashboard)")}>
//<ThemedButton onPress={() => router.navigate("/(auth)/register")}>
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#f1f5eeff',
        paddingHorizontal: 20,
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
  breathingAnimation: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  phaseText: {
    fontSize: 32,
    marginBottom: 40,
    textAlign: 'center',
     minHeight: 40,
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 10,
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
    //fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    //marginTop: 20,
  },
  startButton: {
    //backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  pauseButton: {
    //backgroundColor: '#FF9800',
    paddingHorizontal: 30,
  },
  resumeButton: {
   // backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
  },
  stopButton: {
   // backgroundColor: '#F44336',
    paddingHorizontal: 30,
  },
  finishButton: {
   // backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    marginHorizontal: 5,
  },
  againButton: {
  //  backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    marginHorizontal: 5,
  },
   completedTitle: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: 'center',
    color: '#4CAF50',
  },
})

export default ActivitySession;