import { useState,useRef } from 'react';

export const useActivityTimer = () => {

  const [isActive,setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining,setTimeRemaining] = useState(0);
  const [progress,setProgress] = useState(0);
  const [isCompleted,setIsCompleted] = useState(false);

  const intervalRef = useRef(null);
  //const phaseIntervalRef = useRef(null);
  //const phaseTimeoutsRef = useRef([]);

    const startTimer = (durationInMinutes, onComplete) => {
    setIsActive(true);
    setIsCompleted(false);
    setIsPaused(false);
    const totalSeconds = durationInMinutes * 60;
    setTimeRemaining(totalSeconds);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if(prev <= 1) {
          completeTimer();
          onComplete?.();
          return 0;
        }

        const newTimeRemaining = prev - 1;
        const newProgress = ((totalSeconds - newTimeRemaining) / totalSeconds) * 100;
        setProgress(newProgress);

        return newTimeRemaining;
      });
    }, 1000);


   // if (onPhaseChange) {
   //   onPhaseChange();
   // }
  };

  const pauseTimer = () => {
    setIsPaused(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeTimer = (durationInMinutes, onComplete) => {
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if(prev <= 1) {
          completeTimer();
          onComplete?.();
          return 0;
        }
        
        const totalSeconds = durationInMinutes * 60;
        const newTimeRemaining = prev - 1;
        const newProgress = ((totalSeconds - newTimeRemaining) / totalSeconds) * 100;
        setProgress(newProgress);

        return newTimeRemaining;
      });
    }, 1000);


    //if (onPhaseChange) {
   //   onPhaseChange();
   // }
  };

  const completeTimer = () => {
    setIsCompleted(true);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTimeRemaining(0);
    setProgress(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {

    isActive,
    isPaused,
    isCompleted,
    timeRemaining,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    completeTimer,
    stopTimer,
   // setPhaseTimeouts,
  //  setPhaseInterval,
  };
};

