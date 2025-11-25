import React, { useRef, useState,useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import { useActivityTimer } from '../hooks/useActivityTimer';
import { useTranslation } from '../constants/translations';

const ActivitySession = ({ 
    animationSource,
    onPhaseChange,
    phaseText,
    backRoute,
    animationStyle,
      
    showProgress=true,
    autoStart=false,
    startButtonText ="Start",
    completedText = "Well Done! 🌟",
    finishButtonText = "Finish",
    againButtonText = "Again",
    pauseButtonText = "Pause",
    resumeButtonText = "Resume",

    selectedDuration,
    onStop,
    onComplete,
}) => {
  const router=useRouter()
  const { t } = useTranslation();

  const animationRef = useRef(null);

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
    setPhaseTimeouts,
    setPhaseInterval,
  } = useActivityTimer();

  const handleStart = () => {
    animationRef.current?.reset();
    animationRef.current?.play();

    const phaseHandler = () => onPhaseChange(setPhaseTimeouts,setPhaseInterval);
    startTimer(selectedDuration.duration,handleComplete,phaseHandler);
  };

  const handlePause = () => {
    animationRef.current?.pause();
    pauseTimer();
  }

  const handleResume = () => {  
    animationRef.current?.resume();

    const phaseHandler = () => onPhaseChange(setPhaseTimeouts,setPhaseInterval);
    resumeTimer(selectedDuration.duration,handleComplete,phaseHandler);
  }

  const handleComplete = () => {
    animationRef.current?.pause();
    onComplete?.();
  }

  const handleStop = () => {
    animationRef.current?.reset();
    stopTimer();
    onStop?.();
  }

  const handleFinish = () => {
    handleStop();
    router.push(backRoute);
  }

  const handleAgain = () => {
    handleStop();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
   
  useEffect(() => {
    if(selectedDuration && !isActive && autoStart) {
        handleStart();
    }
  },[selectedDuration, autoStart])


 return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={animationSource}
        autoPlay={false}
        loop={true}
        style={[styles.animation, animationStyle]}
      />

      <ThemedText title={true} style={styles.phaseText}>
        {isCompleted ? completedText : phaseText}
      </ThemedText>
      
      {showProgress &&  (
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
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    //marginTop: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
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

export default ActivitySession;